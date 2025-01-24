from cloudbase import CloudBase

def clear_collection():
    try:
        # 初始化云开发
        app = CloudBase.init({
            'env': 'partjob-1g5flu5ebe7aba48'
        })
        db = app.database()
        
        # 删除集合中所有数据
        result = db.collection('bx_cate').remove()
        
        print('删除成功', result)
        return result
        
    except Exception as e:
        print('删除失败', e)
        return {
            'success': False,
            'error': str(e)
        }

if __name__ == '__main__':
    clear_collection() 