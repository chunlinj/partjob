import json
import requests

def import_data():
    """通过云函数导入数据"""
    try:
        # 读取数据文件
        companies = []
        jobs = []
        
        with open('companies.json', 'r', encoding='utf-8') as f:
            companies = [json.loads(line) for line in f]
            
        with open('jobs.json', 'r', encoding='utf-8') as f:
            jobs = [json.loads(line) for line in f]
            
        print(f"读取到 {len(companies)} 条企业数据, {len(jobs)} 条职位数据")
        
        # TODO: 调用云函数进行导入
        # 需要在小程序端实现调用逻辑
        print("请在小程序管理后台调用导入功能")
        
    except Exception as e:
        print(f"导入失败: {str(e)}")

if __name__ == '__main__':
    import_data() 