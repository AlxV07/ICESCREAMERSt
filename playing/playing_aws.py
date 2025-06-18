#
# DEFINITELY NOT PRODUCTION CODE; JUST PLAYING AROUND w/ BOTO3 TO GET COMFORTABLE w/ METHODS
#


import boto3
from botocore.exceptions import ClientError


class DynamoDBHelper:
    def __init__(self, table_name, region_name='us-east-1', partition_key='id', sort_key='sort_id'):
        self.dynamodb = boto3.resource('dynamodb', region_name=region_name)
        self.table = self.dynamodb.Table(table_name)
        self.partition_key = partition_key
        self.sort_key = sort_key

    def add_item(self, key_value, additional_attributes=None, sort_val=None):
        item = {self.partition_key: key_value, self.sort_key: sort_val}
        if additional_attributes:
            item.update(additional_attributes)
        try:
            self.table.put_item(Item=item)
            print(f"Added item with {self.partition_key}={key_value}")
        except ClientError as e:
            print(f"Error adding item: {e.response['Error']['Message']}")

    def remove_item(self, key_value, sort_val=None):
        try:
            self.table.delete_item(Key={self.partition_key: key_value, self.sort_key: sort_val})
            print(f"Removed item with {self.partition_key}={key_value}")
        except ClientError as e:
            print(f"Error removing item: {e.response['Error']['Message']}")

    def list_all_items(self):
        try:
            response = self.table.scan()
            items = response.get('Items', [])
            print(f"Found {len(items)} items:")
            for item in items:
                print(item)
            return items
        except ClientError as e:
            print(f"Error scanning table: {e.response['Error']['Message']}")
            return []


if __name__ == "__main__":
    helper = DynamoDBHelper(table_name='ICESCREAMERSt', partition_key='ice-partition', sort_key='ice-sort')
    helper.add_item('key1', {'value': 'some value', 'flavor': 'vanilla'}, 'mom')
    helper.list_all_items()
    helper.remove_item('key1', 'mom')
