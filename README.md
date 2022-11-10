## 不一样的

- 极简
- 第三方存储

## 快速开始

### 安装

```python
pip install django-mditor
```

### 将 `mditor` 添加到您的 INSTALLED_APPS 设置中，如下所示：

```python
INSTALLED_APPS = [
    # ...
    'mditor',
]
```

### 将 `meida` 网址添加到您的设置中，如下所示：

```python
MEDIA_ROOT = os.path.join(BASE_DIR, 'uploads')
MEDIA_URL = '/media/'
```

### 像这样将 url 添加到您的 `url.py` 中：

```python
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.conf import settings

# 省略 ...

urlpatterns = [
    # 省略 ...
    url(r'mditor/', include('mditor.urls'))
]

if settings.DEBUG:
    # static files (images, css, javascript, etc.)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### 像这样写你的模型：

```python
from django.db import models
from mditor.fields import MarkDownField


class Article(models.Model):
    """
    文章
    """
    title = models.CharField('标题', max_length=100)
    body = MarkDownField('正文')
```

### 常规操作：

- 在 admin.py 中注册您的模型
- 运行 python manage.py makemigrations 和 python manage.py migrate 来创建你的模型。
- 登录 Admin ，您可以看到一个编辑器文本字段。

## 自定义配置：

**settings.py**

```python
MDITOR_CONFIGS = {
    "default": {
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
}
```

## 问题？

### 是否支持第三方存储？

django-mditor 调用 setting.py 中 `DEFAULT_FILE_STORAGE`，修改 `DEFAULT_FILE_STORAGE` 即可

目前已测试 阿里云 OSS，其他尚未测试。

### 如何将markdown内容渲染成html5？

参考 markdown
