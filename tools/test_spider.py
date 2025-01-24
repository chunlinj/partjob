from spider_qtshe import QTSSpider
import json
from bs4 import BeautifulSoup

def test_first_company():
    spider = QTSSpider()
    
    # 获取武汉首页
    url = 'https://m.qtshe.com/wuhan/'
    html = spider.get_page(url)
    if not html:
        return
    
    soup = BeautifulSoup(html, 'html.parser')
    
    # 获取第一个职位分类链接
    first_category = soup.select_one('.main-list .list-title-child .list-title-more a')
    if not first_category:
        print("未找到职位分类")
        return
        
    category_url = first_category['href']
    print(f"获取分类: {category_url}")
    
    # 获取分类页面中第一个职位链接
    category_html = spider.get_page(category_url)
    if not category_html:
        return
        
    category_soup = BeautifulSoup(category_html, 'html.parser')
    first_job = category_soup.select_one('.partLists a')
    if not first_job:
        print("未找到职位")
        return
        
    job_url = first_job['href']
    print(f"获取职位: {job_url}")
    
    # 解析企业信息
    _, company = spider.parse_job(job_url)
    if company:
        print("\n获取到的企业信息:")
        print(json.dumps(company, ensure_ascii=False, indent=2))
        
        # 保存到文件
        with open('test_company.json', 'w', encoding='utf-8') as f:
            json.dump(company, f, ensure_ascii=False, indent=2)
        print("\n企业数据已保存到 test_company.json")
    else:
        print("未获取到企业信息")

if __name__ == '__main__':
    test_first_company() 