import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap';
import ModalOrder from './ModalOrder';

const OrderList = () => {
    const uid = sessionStorage.getItem('uid');
    const [orders, setOrders] = useState([]);
    const status=['결제대기', '결제확인', '배송준비', '배송완료', '주문완료'];

    const callAPI = async() => {
        const res = await axios.get(`/orders/list?uid=${uid}`);
        // console.log(res.data);
        setOrders(res.data);
    }

    useEffect(()=>{
        callAPI();
    }, [])

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>주문목록</h1>
            <Table hover>
                <colgroup>
                    <col width="15%" />
                    <col width="15%" />
                    <col width="10%" />
                    <col width="10%" />
                    <col width="30%" />
                    <col width="10%" />
                    <col width="15%" />
                </colgroup>
                <thead className='table-dark'>
                    <tr className='text-center'>
                        <td>주문번호</td>
                        <td>주문날짜</td>
                        <td>주문금액</td>
                        <td>전화</td>
                        <td>주소</td>
                        <td>상태</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {orders.map(order =>
                        <tr key={order.pid}>
                            <td>{order.pid}</td>
                            <td>{order.fmtDate}</td>
                            <td>{order.fmtSum}</td>
                            <td>{order.phone}</td>
                            <td className='text-truncate'>{order.address1} {order.address2}</td>
                            <td>{status[order.status]}</td>
                            <td><ModalOrder pid={order.pid} order={order}/></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default OrderList