import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Popconfirm,
  Typography,
  InputNumber,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { dummyProduct } from '../components/constants';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Products = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState(dummyProduct);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record._id === editingKey;
  const [isAdding, setIsAdding] = useState(false);
  const [addingData, setAddingData] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    fetch('http://localhost:5000/getProducts', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setDataSource(data.data);
      });
  };

  const edit = (record) => {
    form.setFieldsValue({
      productName: '',
      productAmount: '',
      productCategory: '',
      amountUnit: '',
      company: '',
      ...record,
    });
    setEditingKey(record._id);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (data) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => data._id === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        const updatedData = newData[index];
        const _id = updatedData._id;
        const productName = updatedData.productName;
        const productCategory = updatedData.productCategory;
        const productAmount = updatedData.productAmount;
        const amountUnit = updatedData.amountUnit;
        const company = updatedData.company;
        await fetch('http://localhost:5000/updateProduct', {
          method: 'POST',
          crossDomain: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            _id,
            productName,
            productCategory,
            productAmount,
            amountUnit,
            company,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            getProducts();
          });
        setEditingKey('');
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const defaultColumns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
      width: '30%',
      editable: true,
    },
    {
      title: 'Product Category',
      dataIndex: 'productCategory',
      editable: true,
    },
    {
      title: 'Product Amount',
      dataIndex: 'productAmount',
      editable: true,
    },
    {
      title: 'Amount Unit',
      dataIndex: 'amountUnit',
      editable: true,
    },
    {
      title: 'Company',
      dataIndex: 'company',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editables = isEditing(record);

        return editables ? (
          <span>
            <Typography.Link
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button>Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              <EditOutlined />
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => onDelete(record._id)}
            >
              <DeleteOutlined style={{ color: 'red', marginLeft: 12 }} />
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const resetAdding = () => {
    setIsAdding(false);
    setAddingData(null);
  };

  const onAdd = (dataSource) => {
    setIsAdding(true);
    setAddingData({ ...dataSource });
  };

  const addNewData = (data) => {
    const productName = data.productName;
    const productCategory = data.productCategory;
    const productAmount = data.productAmount;
    const amountUnit = data.amountUnit;
    const company = data.company;
    fetch('http://localhost:5000/addProduct', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        productName,
        productCategory,
        productAmount,
        amountUnit,
        company,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        getProducts();
      });
  };

  const onDelete = (key) => {
    fetch('http://localhost:5000/deleteProduct', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        prodId: key,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        getProducts();
      });
  };

  const selectedChange = (value) => {
    setAddingData((pre) => {
      return { ...pre, company: value };
    });
  };

  const mergedColumns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <Button href="home">HomePage </Button>
      <Button href="companies">Companies </Button>
      <Button onClick={onAdd}>New Product </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataSource}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <Modal
        title="Add New Product"
        open={isAdding}
        okText="Save"
        onCancel={() => {
          resetAdding();
        }}
        onOk={() => {
          addNewData(addingData);
          resetAdding();
        }}
      >
        <Input
          placeholder="Product Name"
          value={addingData?.productName}
          onChange={(e) => {
            setAddingData((pre) => {
              return { ...pre, productName: e.target.value };
            });
          }}
        />
        <Input
          placeholder="Product Category"
          value={addingData?.productCategory}
          onChange={(e) => {
            setAddingData((pre) => {
              return { ...pre, productCategory: e.target.value };
            });
          }}
        />
        <Input
          placeholder="Product Amount"
          value={addingData?.productAmount}
          onChange={(e) => {
            setAddingData((pre) => {
              return { ...pre, productAmount: e.target.value };
            });
          }}
        />
        <Input
          placeholder="Amount Unit"
          value={addingData?.amountUnit}
          onChange={(e) => {
            setAddingData((pre) => {
              return { ...pre, amountUnit: e.target.value };
            });
          }}
        />
        <Select
          showSearch
          value={addingData?.company}
          placeholder="Company"
          optionFilterProp="children"
          onChange={selectedChange}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={[
            {
              value: 'jack',
              label: 'Jack',
            },
            {
              value: 'lucy',
              label: 'Lucy',
            },
          ]}
        />
      </Modal>
    </div>
  );
};
export default Products;
