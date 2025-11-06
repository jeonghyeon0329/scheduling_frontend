import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPage.css';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 관리자 전용 사용자 목록 API 호출
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/v1/admin/users/');
        setUsers(response.data.data);
      } catch (error) {
        console.error('사용자 목록 로딩 실패:', error);
        alert('사용자 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="admin-page">
      <h1>관리자 페이지</h1>
      <h2>사용자 목록</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>이메일</th>
            <th>상태</th>
            <th>업데이트 시각</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={idx}>
              <td>{u.email}</td>
              <td>{u.status}</td>
              <td>{u.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
