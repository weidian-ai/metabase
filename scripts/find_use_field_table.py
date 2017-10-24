#!/usr/bin/env python
#-*- coding:utf-8 -*-
import MySQLdb
import sys, json, re

reload(sys)
sys.setdefaultencoding('utf8')

NEED_TO_BE_FOUND_FIELD_NAME = 'field_id'
# 保存数据库名称和表结构 
database_structure = {}
# 保存所有的retired的id
retired_field_id = []
# 保存所有删除的信息
deleted_info = []

white_list = [
            'metabase_field', 
            # 'report_card', 
            # 'metabase_fieldvalues', 
            # 'metric', 
            # 'revision', 
            # 'segment', 
            # 'report_dashboardcard'
        ]

# 连接mysql的信息
db_ip = '127.0.0.1'
db_user = 'root'
db_pwd = ''
db_name = 'metabase_offline'
db_port = 3306

# 连接数据库
db = MySQLdb.connect(
    host = db_ip,
    user = db_user,
    db = db_name,
    passwd = db_pwd,
    charset = 'utf8'
)

# 获取游标
cursor = db.cursor()

# 获取所有表名称
SELECT_TABLE_NAMES = 'show tables'

try:
    cursor.execute(SELECT_TABLE_NAMES)
    table_names = cursor.fetchall()

    for name in table_names:
        # table_name = name[0]
        # # 获取每个表中的字段
        # cursor.execute('desc %s' % table_name)
        # print '%s: ' % table_name
        # all_fields = cursor.fetchall()
        # for field in all_fields:
        #     print '\t%s' % field[0]
        table_name = name[0]
        database_structure[table_name] = []
        cursor.execute('desc %s' % table_name)
        all_fields = cursor.fetchall()
        for field in all_fields:
            database_structure[table_name].append(field[0])

    # 获取所有visibility_type为retired字段field
    cursor.execute('select * from metabase_field where visibility_type="retired"')
    all_retired_fields = cursor.fetchall()
    for retired in all_retired_fields:
        deleted_info.append({
            'table': 'metabase_field',
            'data': retired
        })
        retired_field_id.append(int(retired[0]))

    # print retired_field_id
    
    # 开始遍历所有的数据库和数据表
    for table in table_names:
        table_name = table[0]
        if table_name in white_list:
            continue
        if NEED_TO_BE_FOUND_FIELD_NAME in database_structure[table_name]:
            # index = database_structure[table_name].index(NEED_TO_BE_FOUND_FIELD_NAME)
            # 查询出所有的field_id
            cursor.execute('select id, field_id from %s' % table_name)
            field_ids = cursor.fetchall()
            for field in field_ids:
                row_id = field[0]
                field_id = field[1]
                if field_id in retired_field_id:
                    # print "%s's id = %s and field = %s is retired " % (table[0], row_id, field_id)
                    # 保存要删除的信息
                    deleted_info.append({
                        'table': table_name,
                        'data': field
                    })
                    print 'is deleting %s id = %s' % (table_name, row_id) 
                    # 开始删除
                    cursor.execute('delete from %s where id = %s' % (table_name, row_id))
        else:
            if table_name.startswith('query'):
                continue
            # 遍历每个表所有的数据，判断是不是包含field-id这个字段
            cursor.execute('select * from %s' % table_name)
            all_datas = cursor.fetchall()
            
            for datas in all_datas:
                data_id = datas[0]
                for data in datas:
                    if isinstance(data, basestring) and "field-id" in data:
                        # print table_name
                        re_result = re.findall(r'\["field-id",(\d+)\]', data)
                        print re_result
                        if len(re_result) > 0:
                            for re_result_id in re_result:
                                if int(re_result_id) in retired_field_id:  
                                    deleted_info.append({
                                        'table': table_name,
                                        'data': datas
                                    })
                                    print 'is deleting %s id = %s' % (table_name, data_id)
                                    cursor.execute('delete from %s where id = %d' % (table_name, data_id))
                                    # 如果表名是report_card的话，那么则需要删除report_dashboardcard中对应的值
                                    if table_name == 'report_card':
                                        print '===============delete repationship==============='
                                        cursor.execute('delete from report_dashboardcard where card_id = %s' % data_id) 
                                    break
                        break
    # 开始删除metabase_field中的数据
    print 'is deleting the metabase_field'
    for retired_id in retired_field_id:
    #     # print 'is deleting metabase_field id = %s' % retired_id
        cursor.execute('delete from metabase_field where id = %d' % retired_id)
    # commit
    db.commit()                   
except Exception as e:
    db.rollback()
    print '^^^^^error occuring^^^^^'
    print e
finally:
    print 'select end'
    db.close()

# print json.dumps(database_structure, ensure_ascii = False, indent = 2)
# print invalid_datas
