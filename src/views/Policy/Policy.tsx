import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './policy.module.scss';

interface Document {
  name: string;
  path: string;
  size: number;
  updateTime: string;
  type: 'pdf' | 'docx';
}

export default function Policy() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // 直接读取 policy_documents 文件夹中的文件
      const response = await fetch('/policy_documents');
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const links = Array.from(doc.getElementsByTagName('a'));
      
      const docs: Document[] = [];
      
      for (const link of links) {
        const href = link.getAttribute('href');
        if (!href) continue;
        
        const name = href.split('/').pop() || '';
        if (!name.endsWith('.pdf') && !name.endsWith('.docx')) continue;
        
        const type = name.endsWith('.pdf') ? 'pdf' : 'docx';
        
        try {
          const fileResponse = await fetch(href, { method: 'HEAD' });
          const size = Number(fileResponse.headers.get('content-length')) || 0;
          
          docs.push({
            name,
            path: href,
            size,
            updateTime: new Date().toISOString(),
            type,
          });
        } catch (error) {
          console.error(`Failed to get file info for ${name}:`, error);
        }
      }
      
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
      message.error('加载文档失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (doc: Document) => {
    const link = document.createElement('a');
    link.href = doc.path;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (doc: Document) => {
    window.open(doc.path, '_blank');
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const columns: ColumnsType<Document> = [
    {
      title: '文档名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (_, record) => formatFileSize(record.size),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleDownload(record)}>
            下载
          </Button>
          <Button type="link" onClick={() => handlePreview(record)}>
            预览
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>政策文档</h1>
      <Table
        columns={columns}
        dataSource={documents}
        rowKey="path"
        loading={loading}
        pagination={false}
      />
    </div>
  );
}
