from spider_qtshe import QTSSpider
import json

def test_job():
    spider = QTSSpider()
    
    # 直接测试指定的职位URL
    job_url = 'https://m.qtshe.com/job/2750022.html'
    print(f"获取职位: {job_url}")
    
    # 解析职位信息
    job, company = spider.parse_job(job_url)
    
    # 打印企业信息
    if company:
        print("\n获取到的企业信息:")
        print(json.dumps(company, ensure_ascii=False, indent=2))
        
        # 保存企业数据
        with open('test_company.json', 'w', encoding='utf-8') as f:
            json.dump(company, f, ensure_ascii=False, indent=2)
        print("\n企业数据已保存到 test_company.json")
    else:
        print("\n未获取到企业信息")
    
    # 打印职位信息
    if job:
        print("\n获取到的职位信息:")
        print(json.dumps(job, ensure_ascii=False, indent=2))
        
        # 保存职位数据
        with open('test_job.json', 'w', encoding='utf-8') as f:
            json.dump(job, f, ensure_ascii=False, indent=2)
        print("\n职位数据已保存到 test_job.json")
    else:
        print("\n未获取到职位信息")
        
    # 测试邮件发送
    if job or company:
        spider.send_email(
            '青团社测试数据爬取完成', 
            f"""
测试爬取完成!

测试URL: {job_url}
企业数据: {'已获取' if company else '未获取'} 
职位数据: {'已获取' if job else '未获取'}

数据已保存到:
- test_company.json
- test_job.json
            """
        )

if __name__ == '__main__':
    test_job() 