import { Card, Table } from 'antd';
import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [companyData, setCompanyData] = useState([]);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    getCompanies();
    getProducts();
  },[]);

  const getCompanies = () => {
    fetch('http://localhost:5000/getLastCompanies', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setCompanyData(data.data);
      });
  };

  const getProducts = async () => {
    await fetch('http://localhost:5000/getProducts', {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        setProductData(data.data);
      });
  };

  const defaultColumnsComp = [
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      width: '30%',
      editable: true,
    },
    {
      title: 'Company Legal Number',
      dataIndex: 'companyLegalNum',
      editable: true,
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
  ];

  const defaultColumnsProd = [
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
  ];

  return (
    <Card title="EteCube Assignment">
      <Card
        type="inner"
        title="Last Companies"
        extra={<a href="companies">More</a>}
      >
        <Table
          pagination={{ pageSize: 3 }}
          bordered
          dataSource={companyData}
          columns={defaultColumnsComp}
        />
      </Card>
      <Card
        style={{
          marginTop: 16,
        }}
        type="inner"
        title="Last Products"
        extra={<a href="products">More</a>}
      >
        <Table
          pagination={{ pageSize: 3 }}
          bordered
          dataSource={productData}
          columns={defaultColumnsProd}
        />
      </Card>
    </Card>
  );
};

export default HomePage;
