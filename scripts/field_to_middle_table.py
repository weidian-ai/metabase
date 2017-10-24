#!/usr/bin/env python
# -*- coding:utf-8 -*-
import pymysql

import sys

reload(sys)
sys.setdefaultencoding('utf-8')

def check_contain_chinese(check_str):
    for ch in check_str.decode('utf-8'):
        if u'\u4e00' <= ch <= u'\u9fff':
            return True
    return False

def backup_data():
    connection = pymysql.connect(
        host = '127.0.0.1',
        user = 'root',
        database = 'metabase_online_time',
        passwd = '',
        port = 3306,
        charset = 'utf8'
    )
    select_data = "select mf.table_id, mt.db_id, mf.name, mf.display_name from metabase_field as mf join metabase_table as mt on mf.table_id = mt.id where mf.visibility_type = 'normal'"
    with connection.cursor() as cursor:
        try:
            cursor.execute(select_data)
            datas = cursor.fetchall()
            for data in datas:
                (table_id, db_id, e_name, c_name) = data
                if check_contain_chinese(c_name):
                    check_if_exists = 'select * from middle_field_map where db_id = %s and table_id = %s and e_name = \'%s\'' % (db_id, table_id, e_name)
                    cursor.execute(check_if_exists)
                    exists_datas = cursor.fetchall()
                    if len(exists_datas) == 0:
                        # 说明不存在
                        print '正在插入：', data
                        cursor.execute('insert into middle_field_map (db_id, table_id, e_name, c_name) values (%s, %s, %s, %s)', (db_id, table_id, e_name, c_name))
                    else:
                        print '正在更新：', data
                        cursor.execute('update middle_field_map set c_name = %s where db_id = %s and table_id = %s and e_name = %s', (c_name, db_id, table_id, e_name))
            connection.commit()
        except Exception as e:
            connection.rollback()

if __name__ == '__main__':
    backup_data()