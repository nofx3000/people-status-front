import React, { useEffect, useState } from 'react';
import { Card, Button, message, Row, Col } from 'antd';
import styles from './policy.module.scss';

interface Document {
  name: string;
  path: string;
  avatar: string;
  type: 'pdf' | 'docx';
}

export default function Policy() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  const getImageUrl = (path: string) => {
    // 如果路径已经是完整的URL，直接返回
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // 否则添加基础URL
    return `${process.env.REACT_APP_API_URL || ''}${path}`;
  };

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs: Document[] = [
        {
          name: 'Appointment_Letter_PEK147200465125.pdf',
          path: '/policy_documents/Appointment_Letter_PEK147200465125.pdf',
          avatar: '/policy_documents/Appointment_Letter_PEK147200465125.jpg',
          type: 'pdf',
        },
        {
          name: 'Appointment_Letter_PEK147200465125.pdf',
          path: '/policy_documents/Appointment_Letter_PEK147200465125.pdf',
          avatar: '/policy_documents/Appointment_Letter_PEK147200465125.jpg',
          type: 'pdf',
        },
        {
          name: 'Appointment_Letter_PEK147200465125.pdf',
          path: '/policy_documents/Appointment_Letter_PEK147200465125.pdf',
          avatar: '/policy_documents/Appointment_Letter_PEK147200465125.jpg',
          type: 'pdf',
        }
      ];
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
    link.href = getImageUrl(doc.path);
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (doc: Document) => {
    window.open(getImageUrl(doc.path), '_blank');
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>政策文档</h1>
      <Row gutter={[24, 24]} className={styles.cardContainer}>
        {documents.map((doc) => (
          <Col xs={24} sm={12} md={8} key={doc.path}>
            <Card
              hoverable
              loading={loading}
              className={styles.documentCard}
              cover={
                <div className={styles.cardCover}>
                  {doc.avatar ? (
                    <img 
                      src={getImageUrl(doc.avatar)} 
                      alt={doc.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        console.error('Image failed to load:', getImageUrl(doc.avatar));
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    doc.type === 'pdf' ? (
                      <span>PDF</span>
                    ) : (
                      <span>DOC</span>
                    )
                  )}
                </div>
              }
              actions={[
                <Button type="link" onClick={() => handlePreview(doc)}>
                  预览
                </Button>,
                <Button type="link" onClick={() => handleDownload(doc)}>
                  下载
                </Button>,
              ]}
            >
              <Card.Meta
                title={doc.name}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}