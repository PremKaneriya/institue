import React from 'react';
import Layout from '../admin/component/layout/Layout';
import PrivateRoutes from './PrivateRoutes';
import { Route, Routes } from 'react-router';
import Course from '../admin/container/Course/Course';

function AdminRoutes(props) {

    return (
        <>
            <Layout>
                <Routes >
                    <Route element={<PrivateRoutes />}>     
                    <Route exact path="/course" element={<Course/>} />              
                    </Route>
                </Routes>
            </Layout>
        </>
    );
}

export default AdminRoutes;