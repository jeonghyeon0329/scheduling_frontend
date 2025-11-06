import React, { useEffect, useState } from 'react';
import { fetchAdminUsers } from '../../api/adminApis';
// import axios from 'axios';
import './AdminPage.css';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // const data = await fetchAdminUsers();
        const data = [
          {
            email: 'admin@example.com',
            department: '운영팀',
            status: 'active',
            updated_at: new Date().toISOString(),
          },
          {
            email: 'user01@example.com',
            department: '연구팀',
            status: 'inactive',
            updated_at: new Date().toISOString(),
          },
        ];

        setUsers(data);
      } catch (error) {
        console.error('사용자 목록 로딩 실패:', error);
        alert('사용자 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="admin-page">
      <h1>관리자 페이지</h1>
      <h2>사용자 목록</h2>

      <table className="user-table">
        <thead>
          <tr>
            <th>이메일</th>
            <th>소속</th>
            <th>상태</th>
            <th>업데이트 시각</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // ✅ 로딩 중일 때: 스켈레톤 or 플레이스홀더
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="loading-row">
                <td colSpan="4">
                  <div className="loading-bar"></div>
                </td>
              </tr>
            ))
          ) : users.length > 0 ? (
            users.map((u, idx) => (
              <tr key={idx}>
                <td>{u.email}</td>
                <td>{u.department || '—'}</td>  {/* 소속정보 예시 */}
                <td>{u.status}</td>
                <td>{new Date(u.updated_at).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;