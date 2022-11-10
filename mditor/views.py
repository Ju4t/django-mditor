# -*- coding:utf-8 -*-
from django.views import generic
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .configs import MDConfig

MDITOR_CONFIGS = MDConfig('default')


class UploadView(generic.View):
    """ upload image file """

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(UploadView, self).dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        # print(request.FILES)
        upload_image = request.FILES.get("mditor-image-file", None)

        # image none check
        if not upload_image:
            return JsonResponse({
                'success': 0,
                'message': "未获取到要上传的图片",
                'url': ""
            })

        # 文件格式检测
        file_name_list = upload_image.name.split('.')
        file_extension = file_name_list.pop(-1)

        # 忽略大小写
        if file_extension.lower() not in [ext.lower() for ext in MDITOR_CONFIGS['upload_image_formats']]:
            return JsonResponse({
                'success': 0,
                'message': "上传图片格式错误，允许上传图片格式为：%s" % ','.join(MDITOR_CONFIGS['upload_image_formats']),
                'url': ""
            })

        # 路径补全
        if not MDITOR_CONFIGS['image_folder'].endswith('/'):
            MDITOR_CONFIGS['image_folder'] += '/'

        name = MDITOR_CONFIGS['image_folder'] + upload_image.name
        # print(name)  # mditor/000m.jpeg
        file_path = default_storage.save(name=name, content=upload_image)
        # print(file_path)  # mditor/443082150b874fc281cb53c6cad12545.jpeg
        url = default_storage.url(file_path)
        # print(url)  # https://oss.mrbolt.cc/media/mditor/443082150b874fc281cb53c6cad12545.jpeg
        return JsonResponse({
            'success': 1,
            'message': "上传成功！",
            'url': url
        })
