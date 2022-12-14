from django import forms
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.serializers.json import DjangoJSONEncoder
from django.forms.utils import flatatt
# from django.templatetags.static import static
from django.utils.encoding import force_str
from django.utils.functional import Promise
from django.utils.html import conditional_escape
from django.utils.translation import get_language
# from js_asset import JS

from .configs import DEFAULT_CONFIG


class LazyEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, Promise):
            return force_str(obj)
        return super().default(obj)


json_encode = LazyEncoder().encode


class MditorWidget(forms.Textarea):
    """
    Widget providing Mditor for Rich Text Editing.
    Supports direct image uploads and embed.
    """

    template_name = "mditor/widget.html"

    class Media:
        css = {
            'all': ('mditor/css/mditor.min.css',)
        }
        js = (
            "mditor/js/mditor.min.js",
        )

    def __init__(
            self,
            config_name="default",
            extra_plugins=None,
            external_plugin_resources=None,
            *args,
            **kwargs
    ):
        super().__init__(*args, **kwargs)
        # Setup config from defaults.
        self.config = DEFAULT_CONFIG.copy()

        # Try to get valid config from settings.
        configs = getattr(settings, "MDITOR_CONFIGS", None)
        if configs:
            if isinstance(configs, dict):
                # Make sure the config_name exists.
                if config_name in configs:
                    config = configs[config_name]
                    # Make sure the configuration is a dictionary.
                    if not isinstance(config, dict):
                        raise ImproperlyConfigured(
                            'MDITOR_CONFIGS["%s"] \
                                setting must be a dictionary type.'
                            % config_name
                        )
                    # Override defaults with settings config.
                    self.config.update(config)
                else:
                    raise ImproperlyConfigured(
                        "No configuration named '%s' \
                            found in your MDITOR_CONFIGS setting."
                        % config_name
                    )
            else:
                raise ImproperlyConfigured(
                    "MDITOR_CONFIGS setting must be a\
                        dictionary type."
                )

        extra_plugins = extra_plugins or self.config.pop("extra_plugins", None) or []

        if extra_plugins:
            self.config["extraPlugins"] = ",".join(extra_plugins)

        self.external_plugin_resources = (
                external_plugin_resources
                or self.config.pop("external_plugin_resources", None)
                or []
        )

    def get_context(self, name, value, attrs):
        self._set_config()
        external_plugin_resources = [
            [force_str(a), force_str(b), force_str(c)]
            for a, b, c in self.external_plugin_resources
        ]

        # TODO: These context variables should be removed in the next minor/major version.
        #       See the comments below for which variables should be used instead.
        final_attrs = self.build_attrs(self.attrs, {"name": name, **(attrs or {})})
        deprecated_context = {
            # Use `widget.attrs` instead
            # (For `final_attrs.name`, use `widget.name` instead)
            "final_attrs": flatatt(final_attrs),
            # Use `widget.value` instead
            "value": conditional_escape(force_str(value if value is not None else "")),
            # Use `widget.attrs.id` instead
            "id": final_attrs["id"],
        }

        return {
            **super().get_context(name, value, attrs),
            "config": self.config,
            "external_plugin_resources": json_encode(external_plugin_resources),
            **deprecated_context,
        }

    def _set_config(self):
        lang = get_language().lower()
        if lang == "zh-hans":
            lang = "zh-cn"
        elif lang == "zh-hant":
            lang = "zh"
        self.config["language"] = lang
