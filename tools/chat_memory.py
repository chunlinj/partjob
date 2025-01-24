import json
from datetime import datetime

class ChatMemory:
    def __init__(self):
        self.memory_file = 'chat_memory.json'
        
    def is_same_memory(self, mem1, mem2):
        """比较两个记忆是否相同(忽略timestamp)"""
        if not mem1 or not mem2:
            return False
            
        # 创建副本，移除timestamp后比较
        mem1_copy = mem1.copy()
        mem2_copy = mem2.copy()
        mem1_copy.pop('timestamp', None)
        mem2_copy.pop('timestamp', None)
        
        return mem1_copy == mem2_copy
        
    def save_memory(self, memory):
        """保存重要的上下文信息，累积记忆并去重"""
        # 先读取已有的记忆
        existing_memory = self.load_memory() or {}
        
        # 获取今天的日期作为key
        today = datetime.now().strftime('%Y-%m-%d')
        
        # 检查是否与最后一条记忆相同
        if 'history' in existing_memory and today in existing_memory['history']:
            last_memory = existing_memory['history'][today]
            if self.is_same_memory(last_memory, memory):
                print("检测到重复记忆，跳过保存")
                return
        
        # 将今天的记忆添加到历史记忆中
        if 'history' not in existing_memory:
            existing_memory['history'] = {}
        existing_memory['history'][today] = memory
        
        # 更新当前状态
        existing_memory['current'] = memory
        
        try:
            with open(self.memory_file, 'w', encoding='utf-8') as f:
                json.dump(existing_memory, f, ensure_ascii=False, indent=2)
            print(f"记忆已累积保存到 {self.memory_file}")
        except Exception as e:
            print(f"保存记忆失败: {str(e)}")
    
    def load_memory(self):
        """加载之前保存的记忆"""
        try:
            with open(self.memory_file, 'r', encoding='utf-8') as f:
                memory = json.load(f)
            print("已加载之前的记忆:")
            print(json.dumps(memory, ensure_ascii=False, indent=2))
            return memory
        except FileNotFoundError:
            print("未找到之前的记忆")
            return None
        except Exception as e:
            print(f"加载记忆失败: {str(e)}")
            return None

    def add_memory(self, category, content):
        """添加新的记忆"""
        memory = self.load_memory() or {'history': {}, 'current': {}}
        today = datetime.now().strftime('%Y-%m-%d')
        
        if today not in memory['history']:
            memory['history'][today] = {
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'project_info': {},
                'data_structure': {},
                'key_points': [],
                'completed_tasks': [],
                'pending_tasks': [],
                'code_changes': [],
                'test_cases': {}
            }
        
        # 添加新内容到对应类别
        if isinstance(content, list):
            memory['history'][today][category].extend(content)
        elif isinstance(content, dict):
            memory['history'][today][category].update(content)
        
        # 更新当前状态
        memory['current'] = memory['history'][today]
        
        self.save_memory(memory)
        print(f"已添加新的{category}记忆")

# 使用示例
if __name__ == '__main__':
    memory = ChatMemory()
    
    # 添加新的关键点
    memory.add_memory('key_points', ['新发现的问题：SSL证书验证失败'])
    
    # 添加新的完成任务
    memory.add_memory('completed_tasks', ['修复了SSL验证问题'])
    
    # 保存当前上下文
    memory.save_memory()
    
    # 加载之前的记忆
    memory.load_memory() 