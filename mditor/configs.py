from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

DEFAULT_CONFIG = {
    "width": "auto",
    "MinWidth": "535px",
    "MaxWidth": "880px",
    "height": "450px",
    "preview": "false",
    "split": "false",
    "fullscreen": "false",
    "upload_image_formats": ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
    "image_folder": "mditor",
}


class MDConfig(dict):

    def __init__(self, config_name='default'):
        self.update(DEFAULT_CONFIG)
        self.set_configs(config_name)

    def set_configs(self, config_name='default'):
        """
        set config item
        :param config_name:
        :return:
        """
        # Try to get valid config from settings.
        configs = getattr(settings, 'MDITOR_CONFIGS', None)
        if configs:
            if isinstance(configs, dict):
                # Make sure the config_name exists.
                if config_name in configs:
                    config = configs[config_name]
                    # Make sure the configuration is a dictionary.
                    if not isinstance(config, dict):
                        raise ImproperlyConfigured('MDITOR_CONFIGS["%s"] \
                                        setting must be a dictionary type.' %
                                                   config_name)
                    # Override defaults with settings config.
                    self.update(config)
                else:
                    raise ImproperlyConfigured("No configuration named '%s' \
                                    found in your MDITOR_CONFIGS setting." %
                                               config_name)
            else:
                raise ImproperlyConfigured('MDITOR_CONFIGS setting must be a\
                                dictionary type.')
