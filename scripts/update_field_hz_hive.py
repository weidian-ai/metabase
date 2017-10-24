#!/usr/bin/dev python
#-*- coding: utf-8 -*-
import MySQLdb
import requests
import sys
import json

reload(sys)
sys.setdefaultencoding('utf8')

# hive_table_name
hive_table_name = [
    # 'hzdi.rpt_wdbuyer_leimu_chengjiao_di', # 2
    # 'hzdi.rpt_wdbuyer_dapan_zhuanhua_di',  # 2
    # 'hzdi.edw_jd_item_spu_check_dd',  # 2
    # 'hzdi.rpt_zhanhui_external_act_report_dd', # 2
    # 'hzdi.rpt_koubei_store_overview_di', # 1
    # 'hzdi.rpt_fx_kpi_daily_trend_di' # 1
    'hzdi.rpt_fx_tmh_daily_di'
]

table_prefix = 'hzkudu_'
db_name = 'impala-kudu'
request_url = 'http://coling.vdian.net/report/table/schema/query?hiveTableName=%s'
exists_table = []

# 连接数据库
def connect_db():
    db_config = {
        "host": "127.0.0.1",
        "user": "root",
        "db": "metabase_online_hz",
        "passwd": "",
        "port": 3306,
        "charset": "utf8"
    }
    db = MySQLdb.connect(
        host = db_config['host'],
        user = db_config['user'],
        db = db_config['db'],
        passwd = db_config['passwd'],
        port = db_config['port'],
        charset = db_config['charset']
    )

    return db

def get_config_data():
    config_data = {}
    for table in hive_table_name:
        result = requests.get(request_url % table).json()
        field_name = table_prefix + table.split('.')[1]
        if result['success']:
            # config_data[field_name] = result['data'][0]['schema']
            # 把数据拉平
            exists_table.append(field_name)
            ''' 
                表名_字段名 : 中文名称
            '''
            schemas = result['data'][0]['schema'] if len(result['data']) > 0 else []
            for schema in schemas:
                config_data[field_name + '.' + schema['field']] = schema['name']
        else:
            print 'get %s data failed' % table
    return config_data

def main():
    db = connect_db()
    config_data = get_config_data()
    cursor = db.cursor()
    # 选出数据库的id
    cursor.execute('SELECT id FROM metabase_database WHERE name = \"%s\"' % db_name)
    db_id = cursor.fetchone()
    if db_id is None:
        exit('cannot find the database')
    else:
        db_id = db_id[0]
        # foramt table name to make sql
        format_table_name = [('"' + table_prefix + name.split('.')[1] + '"') for name in hive_table_name]
        # 选出杭州的表
        select_table_sql = 'SELECT id, name FROM metabase_table WHERE db_id = %d AND name in (%s)' % (db_id, ", ".join(format_table_name))
        cursor.execute(select_table_sql)
        table_result = cursor.fetchall()
        # print table_result;
        try:
            for result in table_result:
                (table_id, table_name) = result
                if table_name in exists_table:
                    cursor.execute('SELECT name from metabase_field WHERE table_id = %s' % table_id)
                    field_names = cursor.fetchall()
                    for name in field_names:
                        name = name[0] # 字段名称
                        if config_data.get(table_name + '.' + name, None) is not None:
                            cursor.execute('UPDATE metabase_field set display_name = \"%s\" WHERE table_id = %s AND name = \"%s\"' % (config_data.get(table_name + '.' + name), table_id, name))
                            print "^"*10, "%s：%s 的 %s 字段更新成功" % (table_id, table_name, name), "^"*10
                        else:
                            print "="*10, "%s：%s 的 %s 字段没有对应的中文配置信息" % (table_id, table_name, name), "="*10
                else:
                    print "*"*10,"%s：%s 的数据不存在" % (table_id, table_name), "*"*10
            db.commit()       
        except Exception as e:
            db.rollback()
            print 'error occured'
            print e
            raise e
            
def format_output(json_data):
    return json.dumps(json_data, ensure_ascii = False, indent = 2)

if __name__ == '__main__':
    main()
    # print format_output(get_config_data())