from spider_qtshe import QTSSpider
import json

def test_company():
    spider = QTSSpider()
    
    # 直接测试指定的企业URL
    company_url = 'https://m.qtshe.com/company/4543173.html'
    print(f"获取企业: {company_url}")
    
    # 解析企业信息
    company = spider.parse_company(company_url)
    
    if company:
        print("\n获取到的企业信息:")
        print(json.dumps(company, ensure_ascii=False, indent=2))
        
        # 保存企业数据
        with open('test_company.json', 'w', encoding='utf-8') as f:
            json.dump(company, f, ensure_ascii=False, indent=2)
        print("\n企业数据已保存到 test_company.json")
    else:
        print("\n未获取到企业信息")

if __name__ == '__main__':
    test_company() 