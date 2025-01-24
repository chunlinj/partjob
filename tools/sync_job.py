from spider_qtshe import QTSSpider
import schedule
import time

def sync_task():
    spider = QTSSpider()
    # 爬取数据
    spider.crawl('https://m.qtshe.com/wuhan/')
    
    # 同步到数据库
    result = spider.sync_data()
    
    # 发送邮件通知
    if result:
        subject = '青团社数据同步完成'
        content = f"""
数据同步完成!

更新统计:
- 新增职位: {result['jobs_added']}
- 删除职位: {result['jobs_deleted']}
- 新增企业: {result['companies_added']}
- 删除企业: {result['companies_deleted']}
        """
        spider.send_email(subject, content)

def main():
    # 设置每天凌晨2点执行
    schedule.every().day.at("02:00").do(sync_task)
    
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == '__main__':
    main() 