import os
import sys
from pathlib import Path

def create_project_snapshot(directory, output_file='project_snapshot.txt'):
    # 需要忽略的目录
    IGNORE_DIRS = {
        'node_modules',
        '.git',
        '__pycache__',
        'miniprogram_npm',
        'dist',
        'build'
    }
    
    # 需要包含的文件扩展名
    INCLUDE_EXTENSIONS = {
        '.js', '.json', '.wxss', '.wxml', '.css', '.html', '.md',
        '.config.js', '.config.json'
    }
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            # 写入项目结构
            f.write("# 项目结构\n")
            f.write("=" * 50 + "\n\n")
            
            # 使用递归方式生成目录树
            def write_tree(dir_path, prefix=""):
                entries = sorted(os.scandir(dir_path), key=lambda e: e.name)
                for idx, entry in enumerate(entries):
                    if entry.name.startswith('.'):
                        continue
                    if entry.is_dir():
                        if entry.name in IGNORE_DIRS:
                            continue
                        f.write(f"{prefix}{'└──' if idx == len(entries)-1 else '├──'} {entry.name}/\n")
                        write_tree(entry.path, prefix + ("    " if idx == len(entries)-1 else "│   "))
                    else:
                        f.write(f"{prefix}{'└──' if idx == len(entries)-1 else '├──'} {entry.name}\n")
            
            write_tree(directory)
            
            # 写入文件内容
            f.write("\n\n# 文件内容\n")
            f.write("=" * 50 + "\n\n")
            
            for root, dirs, files in os.walk(directory):
                # 跳过需要忽略的目录
                dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith('.')]
                
                for file in files:
                    if file.startswith('.'):
                        continue
                        
                    file_path = os.path.join(root, file)
                    extension = Path(file).suffix
                    
                    if extension in INCLUDE_EXTENSIONS or file.endswith(tuple(INCLUDE_EXTENSIONS)):
                        try:
                            with open(file_path, 'r', encoding='utf-8') as code_file:
                                f.write(f"\n## 文件：{file_path}\n")
                                f.write("-" * 50 + "\n")
                                f.write(code_file.read())
                                f.write("\n" + "-" * 50 + "\n")
                        except Exception as e:
                            f.write(f"\n## 文件：{file_path}\n")
                            f.write("-" * 50 + "\n")
                            f.write(f"无法读取文件内容：{str(e)}\n")
                            f.write("-" * 50 + "\n")
            
            print(f"项目快照已生成：{output_file}")
            
    except Exception as e:
        print(f"生成快照时出错：{str(e)}")

if __name__ == "__main__":
    # 获取当前目录
    current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print(f"项目根目录: {current_dir}")
    
    # 指定输出文件的完整路径
    output_file = os.path.join(current_dir, 'project_snapshot.txt')
    
    # 生成快照
    create_project_snapshot(current_dir, output_file)
    print(f"项目快照已生成在: {output_file}") 