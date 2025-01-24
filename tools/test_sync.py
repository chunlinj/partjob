from spider_qtshe import QTSSpider
import json
import requests

def test_sync():
    spider = QTSSpider()
    
    # 从文件加载数据
    try:
        # 加载企业数据
        with open('companies.json', 'r', encoding='utf-8') as f:
            spider.companies = [json.loads(line) for line in f]
            
        # 加载职位数据
        with open('jobs.json', 'r', encoding='utf-8') as f:
            spider.jobs = [json.loads(line) for line in f]
            
        print(f"已加载 {len(spider.companies)} 个企业, {len(spider.jobs)} 个职位")
        
        # 调用云函数
        result = spider.sync_data()
        
        if result:
            print("\n同步结果:")
            print(f"- 新增职位: {result['jobs_added']}")
            print(f"- 删除职位: {result['jobs_deleted']}")
            print(f"- 新增企业: {result['companies_added']}")
            print(f"- 删除企业: {result['companies_deleted']}")
            
    except FileNotFoundError:
        print("未找到数据文件，请先运行爬虫获取数据")
    except Exception as e:
        print(f"测试同步失败: {str(e)}")

if __name__ == '__main__':
    test_sync() 