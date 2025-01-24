import sys
sys.path.append('./miniprogram/projects/jobpart/public')
import requests
from bs4 import BeautifulSoup
import json
import time
import random
from datetime import datetime, timedelta
import re
import urllib3
import smtplib
from email.mime.text import MIMEText
from email.header import Header
from pymongo import MongoClient
import hashlib

# 删除导入语句，直接定义常量
CATE_STAR = ['5星推荐', '4星推荐', '3星推荐', '2星推荐', '1星推荐']
CATE_SIZE = ['大型', '中型', '小型', '微型']
CATE_TYPE = ['央企', '国企', '民企', '个体户', '政府机关', '事业单位', '外资', '合资', '其他']
CATE_TRADE = ['互联网/计算机', '电子/电气/通信', '产品', '客服/运营', '销售/商业', '人力/行政/法务', 
              '财务/审计/税务', '生产制造', '零售/生活服务', '餐饮', '酒店/旅游', '教育培训', '设计', 
              '物业/房地产/建筑', '直播/影视/传媒/娱乐', '市场/公关/广告', '物流/仓储/司机', 
              '采购/贸易', '汽车', '医疗健康', '金融', '咨询/翻译/法律', '能源/环保/农业', '高级管理', '其他']

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class QTSSpider:
    def __init__(self):
        self.CATE_TYPE = CATE_TYPE
        self.CATE_TRADE = CATE_TRADE
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.base_url = 'https://m.qtshe.com'
        self.companies = [] # 存储企业数据
        self.jobs = [] # 存储职位数据
        self.notify_email = '1499831507@qq.com'
        
        # 修改数据库连接
        self.env = 'partjob-1g5flu5ebe7aba48'  # 云环境ID
        self.api_url = 'https://api.weixin.qq.com/tcb/databasequery'
        
    def generate_cate_id(self):
        """生成CATE_ID"""
        # 格式: 年月日时分秒+4位随机数
        now = datetime.now()
        random_num = random.randint(1000, 9999)
        return f"{now.strftime('%Y%m%d%H%M%S')}{random_num}"

    def get_page(self, url):
        """获取页面内容"""
        try:
            # 禁用SSL验证
            response = requests.get(url, headers=self.headers, verify=False)
            response.encoding = 'utf-8'
            return response.text
        except Exception as e:
            print(f"获取页面失败: {url}")
            print(f"错误信息: {str(e)}")
            return None

    def parse_money(self, money_str):
        """解析薪资字符串"""
        if not money_str:
            return ''
        
        # 移除所有空白字符
        money_str = ''.join(money_str.split())
        
        # 提取数字
        numbers = re.findall(r'\d+', money_str)
        if not numbers:
            return money_str
            
        if '天' in money_str:
            return f"{numbers[0]}/天"
        elif '月' in money_str:
            return f"{numbers[0]}/月"
        elif '时' in money_str:
            return f"{numbers[0]}/小时"
        else:
            return money_str

    def parse_company(self, url):
        """解析企业详情页"""
        html = self.get_page(url)
        if not html:
            return None
            
        soup = BeautifulSoup(html, 'html.parser')
        
        try:
            # 设置两个不同的图片路径
            form_cover_url = 'cloud://partjob-1g5flu5ebe7aba48.7061-partjob-1g5flu5ebe7aba48-1336740853/jobpart/cate/b834edac678e4433018864286c7ca0ca/image_8055854.png'
            obj_cover_url = 'http://tmp/V4AOrjEIQZUIa18229f070d8d4c05cf562d5dc193d8f.png'
            
            company = {
                '_pid': 'jobpart',
                'CATE_ID': self.generate_cate_id(),
                'CATE_TITLE': soup.select_one('.companyname').text.strip(),
                'CATE_ORDER': 9999,
                'CATE_STATUS': 1,
                'CATE_CNT': 1,
                'CATE_VOUCH': 0,
                'CATE_QR': '',
                'CATE_SOURCE': '青团社',
                'CATE_SOURCE_URL': url,
                'CATE_ADD_TIME': int(time.time()),
                'CATE_EDIT_TIME': int(time.time()),
                'CATE_ADD_IP': '',
                'CATE_EDIT_IP': '',
                'CATE_FORMS': [{
                    'mark': 'cover',
                    'title': '封面图',
                    'type': 'image',
                    'val': [form_cover_url]  # 表单中使用云存储路径
                }],
                'CATE_OBJ': {
                    'content': [{
                        'type': 'text',
                        'val': ''
                    }],
                    'cover': [obj_cover_url],  # CATE_OBJ 中使用临时路径
                    'size': '小型',
                    'star': '4星推荐',
                    'trade': '餐饮',
                    'type': '个体户'
                }
            }
            
            # 需要获取的字段
            fields = ['企业类型', '经营状态', '成立时间', '注册地址', '统一信用代码', '组织机构代码', '经营范围']
            content = []
            
            # 获取企业详情内容
            for field in fields:
                label = soup.find('span', class_='desccont_lab', text=field)
                if label:
                    value = label.find_next('span', class_='desccont_msg')
                    if value:
                        value_text = value.text.strip()
                        content.append(f"{field}：{value_text}")
                        
                        # 处理企业类型
                        if field == '企业类型':
                            if '个体' in value_text:
                                company['CATE_OBJ']['type'] = '个体户'
                            else:
                                for type_val in self.CATE_TYPE:
                                    if type_val in value_text:
                                        company['CATE_OBJ']['type'] = type_val
                                        break
                        
                        # 处理行业分类(从经营范围中匹配)
                        elif field == '经营范围':
                            # 提取许可项目后的内容
                            if '许可项目：' in value_text:
                                scope = value_text.split('许可项目：')[1].split('；')[0].strip()
                                # 直接按照每个字符分割，然后取前两个字
                                words = scope[:2]
                                if words:
                                    # 用提取的词去匹配行业
                                    for trade_val in self.CATE_TRADE:
                                        if words in trade_val:
                                            company['CATE_OBJ']['trade'] = trade_val
                                            break
            
            # 将内容设置为正确的格式
            company['CATE_OBJ']['content'][0]['val'] = '\n'.join(content)
            
            return company
            
        except Exception as e:
            print(f"解析企业页面失败: {url}")
            print(f"错误信息: {str(e)}")
            return None

    def parse_job(self, url):
        """解析职位详情页"""
        html = self.get_page(url)
        if not html:
            print(f"获取职位页面失败: {url}")
            return None, None
        
        soup = BeautifulSoup(html, 'html.parser')
        
        try:
            # 获取企业链接
            company_link = soup.select_one('a[href*="/company/"]')
            company = None
            
            # 如果找到企业链接，则解析企业信息
            if company_link:
                company_url = company_link['href']
                if not company_url.startswith('http'):
                    company_url = self.base_url + company_url
                
                company = self.parse_company(company_url)
            
            # 获取职位信息
            job_title = soup.select_one('.jobTop h1')
            if not job_title:
                print(f"未找到职位标题: {url}")
                return None, None
            
            # 获取发布时间
            create_time_elem = soup.select_one('.createTime')
            if create_time_elem:
                create_time_str = create_time_elem.text.replace('发布时间：', '').strip()
                try:
                    # 将字符串转换为时间戳
                    create_time = datetime.strptime(create_time_str, '%Y-%m-%d %H:%M:%S')
                    start_time = int(create_time.timestamp() * 1000)  # 转换为毫秒
                    # 结束时间为开始时间后3个月
                    end_time = int((create_time + timedelta(days=90)).timestamp() * 1000)  # 转换为毫秒
                except:
                    start_time = int(time.time() * 1000)  # 转换为毫秒
                    end_time = int((datetime.now() + timedelta(days=90)).timestamp() * 1000)  # 转换为毫秒
            else:
                start_time = int(time.time() * 1000)  # 转换为毫秒
                end_time = int((datetime.now() + timedelta(days=90)).timestamp() * 1000)  # 转换为毫秒
            
            # 获取工作地址
            address_elem = soup.select_one('.jobAddress span')
            address = address_elem.text.strip() if address_elem else ''
            
            # 获取经纬度
            latitude_elem = soup.select_one('#latitude')
            longitude_elem = soup.select_one('#longitude')
            latitude = float(latitude_elem['value']) if latitude_elem else 0
            longitude = float(longitude_elem['value']) if longitude_elem else 0
            
            # 获取结算方式
            pay_elem = soup.select_one('.jobTop div:first-child a:last-child')
            pay_val = pay_elem.text.strip() if pay_elem else '日结'

            # 获取人员要求
            person_elems = soup.select('.interaddr')
            person_val = '\n'.join([elem.text.strip() for elem in person_elems]) if person_elems else ''

            # 获取详细说明
            desc_elem = soup.select_one('.desccont')
            desc_val = desc_elem.text.strip() if desc_elem else ''

            # 准备职位表单数据
            forms = [
                {
                    'mark': 'type',
                    'title': '类型',
                    'type': 'select',
                    'val': '固定兼职'  # 默认固定兼职
                },
                {
                    'mark': 'pay',
                    'title': '结算方式',
                    'type': 'select',
                    'val': pay_val
                },
                {
                    'mark': 'biz',
                    'title': '岗位分类',
                    'type': 'select',
                    'val': soup.select_one('.job-category').text.strip() if soup.select_one('.job-category') else '其他'
                },
                {
                    'mark': 'date',
                    'title': '工作日期',
                    'type': 'text',
                    'val': create_time_str  # 使用发布时间
                },
                {
                    'mark': 'time',
                    'title': '工作时间',
                    'type': 'text',
                    'val': '不限'  # 默认不限
                },
                {
                    'mark': 'person',
                    'title': '人员要求',
                    'type': 'textarea',
                    'val': person_val
                },
                {
                    'mark': 'money',
                    'title': '工资待遇',
                    'type': 'text',
                    'val': self.parse_money(soup.select_one('.salary').text.strip() if soup.select_one('.salary') else '')
                },
                {
                    'mark': 'desc',
                    'title': '详细说明',
                    'type': 'textarea',
                    'val': desc_val
                }
            ]

            # 根据forms生成ACTIVITY_OBJ
            activity_obj = {}
            for form in forms:
                activity_obj[form['mark']] = form['val']

            job = {
                '_pid': 'jobpart',
                'ACTIVITY_TITLE': job_title.text.strip(),
                'ACTIVITY_SOURCE': '青团社',
                'ACTIVITY_SOURCE_URL': url,
                'ACTIVITY_CATE_NAME': company['CATE_TITLE'] if company else '',
                'ACTIVITY_CATE_ID': company['CATE_ID'] if company else '',
                'ACTIVITY_STATUS': 1,
                'ACTIVITY_ORDER': 9999,
                'ACTIVITY_MAX_CNT': 50,
                'ACTIVITY_START': start_time,
                'ACTIVITY_END': end_time,
                'ACTIVITY_CHECK_SET': 0,
                'ACTIVITY_CANCEL_SET': 1,
                'ACTIVITY_COMMENT_CNT': 0,
                'ACTIVITY_FORMS': forms,
                'ACTIVITY_JOIN_FORMS': [],
                'ACTIVITY_ADDRESS': address,
                'ACTIVITY_ADDRESS_GEO': {
                    'name': address,      # 使用地址作为名称
                    'address': address,   # 使用地址
                    'latitude': latitude, # 使用获取到的经纬度
                    'longitude': longitude
                },
                'ACTIVITY_OBJ': activity_obj,
                'ACTIVITY_ADD_TIME': int(time.time()),
                'ACTIVITY_EDIT_TIME': int(time.time()),
                'ACTIVITY_JOIN_CNT': 0
            }
            
            return job, company
            
        except Exception as e:
            print(f"解析职位页面出错: {url}")
            print(f"错误信息: {str(e)}")
            return None, None

    def crawl(self, url):
        """爬取主页面"""
        html = self.get_page(url)
        if not html:
            return
        
        soup = BeautifulSoup(html, 'html.parser')
        
        # 获取所有职位分类
        categories = soup.select('.main-list .list-title-child .list-title-more a')
        
        for category in categories:
            # 直接使用href的值，不需要拼接
            category_url = category['href']
            print(f"爬取职位分类: {category_url}")
            
            # 获取分类页面
            category_html = self.get_page(category_url)
            if not category_html:
                continue
                
            category_soup = BeautifulSoup(category_html, 'html.parser')
            
            # 获取职位列表
            job_links = category_soup.select('.partLists a')
            
            for job_link in job_links:
                job_url = job_link['href']
                print(f"爬取职位详情: {job_url}")
                
                # 解析职位和企业信息
                job, company = self.parse_job(job_url)
                
                if job:
                    # 只有在成功获取到企业信息时才保存企业
                    if company:
                        # 检查是否已存在相同企业
                        exists = False
                        for existing_company in self.companies:
                            if existing_company['CATE_TITLE'] == company['CATE_TITLE']:
                                exists = True
                                break
                                
                        if not exists:
                            self.companies.append(company)
                            
                    self.jobs.append(job)
                    
                # 随机延迟
                time.sleep(random.uniform(1, 3))
                
        # 保存数据
        self.save_data()
        
    def send_email(self, subject, content):
        """发送邮件通知"""
        try:
            # 邮件服务器配置
            smtp_host = 'smtp.qq.com'
            smtp_port = 465
            smtp_user = '1499831507@qq.com'  # 发件人邮箱
            smtp_pass = 'mbugvlbsjnzxiijh'   # SMTP授权码
            
            # 构建邮件内容
            msg = MIMEText(content, 'plain', 'utf-8')
            msg['Subject'] = Header(subject, 'utf-8')
            msg['From'] = smtp_user
            msg['To'] = self.notify_email
            
            # 发送邮件
            with smtplib.SMTP_SSL(smtp_host, smtp_port) as smtp:
                smtp.login(smtp_user, smtp_pass)
                smtp.sendmail(smtp_user, [self.notify_email], msg.as_string())
                print(f"通知邮件已发送到 {self.notify_email}")
                
        except smtplib.SMTPException as e:
            print(f"发送邮件失败: {str(e)}")
        except Exception as e:
            if "(-1, b'\\x00\\x00\\x00')" not in str(e):  # 忽略特定的关闭错误
                print(f"发送邮件失败: {str(e)}")
    
    def save_data(self):
        """保存数据到文件"""
        # 保存企业数据
        if self.companies:
            with open('companies.json', 'w', encoding='utf-8') as f:
                # 每行一条数据，方便云开发导入
                for company in self.companies:
                    f.write(json.dumps(company, ensure_ascii=False) + '\n')
            print(f"企业数据已保存到 companies.json")
            
        # 保存职位数据    
        if self.jobs:
            with open('jobs.json', 'w', encoding='utf-8') as f:
                # 每行一条数据，方便云开发导入
                for job in self.jobs:
                    f.write(json.dumps(job, ensure_ascii=False) + '\n')
            print(f"职位数据已保存到 jobs.json")
            
        print(f"数据保存完成! 共爬取 {len(self.companies)} 个企业, {len(self.jobs)} 个职位")
        
        # 发送邮件通知
        subject = '青团社数据爬取完成'
        content = f"""
爬取任务已完成!

统计信息:
- 企业数量: {len(self.companies)}
- 职位数量: {len(self.jobs)}

数据已保存到:
- companies.json
- jobs.json
        """
        self.send_email(subject, content)

    def generate_data_hash(self, data):
        """生成数据的唯一标识"""
        # 根据关键字段生成hash
        key_str = f"{data.get('ACTIVITY_TITLE', '')}{data.get('ACTIVITY_ADDRESS', '')}"
        return hashlib.md5(key_str.encode()).hexdigest()
        
    def sync_data(self):
        """同步数据到数据库"""
        try:
            print("注意: 目前只能通过微信开发者工具的云开发控制台操作数据库")
            print("请使用云开发控制台导入 companies.json 和 jobs.json 文件")
            print("\n操作步骤:")
            print("1. 打开微信开发者工具")
            print("2. 点击'云开发'")
            print("3. 选择'数据库'")
            print("4. 选择对应集合")
            print("5. 点击'导入'")
            print("6. 选择对应的 JSON 文件")
            
            return {
                'jobs_added': len(self.jobs),
                'jobs_deleted': 0,
                'companies_added': len(self.companies),
                'companies_deleted': 0
            }
            
        except Exception as e:
            print(f"数据同步失败: {str(e)}")
            return None

def main():
    spider = QTSSpider()
    spider.crawl('https://m.qtshe.com/wuhan/')

if __name__ == '__main__':
    main() 