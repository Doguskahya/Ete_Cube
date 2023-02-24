import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Popconfirm,
  Typography,
  InputNumber,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

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

const Companies = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record._id === editingKey;
  const [isAdding, setIsAdding] = useState(false);
  const [addingData, setAddingData] = useState(null);

  useEffect(() => {
    getCompanies();
  }, []);

  const getCompanies = async () => {
    await fetch('http://localhost:5000/getCompanies', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setDataSource(data.data);
      });
  };

  const edit = (record) => {
    form.setFieldsValue({
      companyName: '',
      companyLegalNum: '',
      incorpCountry: '',
      webSite: '',
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
        const updated = newData[index];
        const _id = updated._id;
        const companyName = updated.companyName;
        const incorpCountry = updated.incorpCountry;
        const companyLegalNum = updated.companyLegalNum;
        const webSite = updated.webSite;
        await fetch('http://localhost:5000/updateCompany', {
          method: 'POST',
          crossDomain: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            _id,
            companyName,
            incorpCountry,
            companyLegalNum,
            webSite,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            getCompanies();
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
      title: 'Company Name',
      dataIndex: 'companyName',
      width: '30%',
      editable: true,
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
      sortDirections: ['descend'],
    },
    {
      title: 'Company Legal Number',
      dataIndex: 'companyLegalNum',
      editable: true,
      sorter: (a, b) => a.companyLegalNum - b.companyLegalNum,
    },
    {
      title: 'Incorporation Country',
      dataIndex: 'incorpCountry',
      editable: true,
    },
    {
      title: 'Website',
      dataIndex: 'webSite',
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
    const companyName = data.companyName;
    const incorpCountry = data.incorpCountry;
    const companyLegalNum = data.companyLegalNum;
    const webSite = data.webSite;
    fetch('http://localhost:5000/addCompany', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        companyName,
        incorpCountry,
        companyLegalNum,
        webSite,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        getCompanies();
      });
  };

  const onDelete = (key) => {
    fetch('http://localhost:5000/deleteCompany', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        compId: key,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        getCompanies();
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
      <Button className="home-page-button" href="home">
        HomePage{' '}
      </Button>
      <Button className="other-page-button" href="products">
        Products{' '}
      </Button>
      <Button className="new-button" onClick={onAdd} type="primary">
        New Company{' '}
      </Button>
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
        title="Add New Company"
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
          placeholder="Company Name"
          value={addingData?.companyName}
          onChange={(e) => {
            setAddingData((pre) => {
              return { ...pre, companyName: e.target.value };
            });
          }}
        />
        <Input
          placeholder="Company Legal Number"
          value={addingData?.companyLegalNum}
          onChange={(e) => {
            setAddingData((pre) => {
              return { ...pre, companyLegalNum: e.target.value };
            });
          }}
        />
        <Input
          placeholder="Incorporation Country"
          value={addingData?.incorpCountry}
          onChange={(e) => {
            setAddingData((pre) => {
              return { ...pre, incorpCountry: e.target.value };
            });
          }}
        />
        <Input
          placeholder="Website"
          value={addingData?.webSite}
          onChange={(e) => {
            setAddingData((pre) => {
              return { ...pre, webSite: e.target.value };
            });
          }}
        />
      </Modal>
    </div>
  );
};
export default Companies;
