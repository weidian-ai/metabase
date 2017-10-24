#!/usr/bin/env python
#-*- coding:utf-8 -*-

import sys, json, re
import MySQLdb

reload(sys)
sys.setdefaultencoding('utf8')

# 定义数据库的连接信息
# db_ip = '127.0.0.1'
# db_user = 'root'
# db_pwd = ''
# db_name = 'metabase_offline'
# db_port = 3306
db_ip = "10.2.7.176"
db_user = "dsp_test"
db_pwd = "Resys@748"
db_name = "metabase_test"
db_port = 3306

# 需要操作的数据库
field_map = 'field_map'
metabase_field = 'metabase_field'

db = MySQLdb.connect(
        host = db_ip,
        user = db_user,
        db = db_name,
        passwd = db_pwd,
        port = db_port
    )

def check_contain_chinese(check_str):
    for ch in check_str.decode('utf-8'):
        if u'\u4e00' <= ch <= u'\u9fff':
            return True
    return False

try:
    cursor = db.cursor()
    cursor.execute('SELECT table_id, fields_map FROM %s' % field_map)
    fields = cursor.fetchall()
    for field in fields:
        table_id = field[0]
        fields_map = json.loads(field[1])        
        cursor.execute('SELECT table_id, name, display_name FROM %s WHERE table_id = %s' % (metabase_field, table_id))
        all_fields = cursor.fetchall()
        for (table_id, name, display_name) in all_fields:
            if fields_map.has_key(name):
                # print name, '---->', display_name, '---->', fields_map[name]
                if check_contain_chinese(display_name):
                    print display_name
                else:
                    # print name, '---->', display_name, '---->', fields_map[name]
                    cursor.execute('UPDATE %s set display_name = \"%s\" where table_id = %s and name = \"%s\"' % (metabase_field, fields_map[name], table_id, name))
    db.commit()
    print '更新成功'
except Exception as e:
    print e
    db.rollback()