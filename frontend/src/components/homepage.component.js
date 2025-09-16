import React, {Component, useState} from "react";
import {BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import {View, Text, StyleSheet} from 'react-native';

export default function Homepage(){
    const [isAdmin,setIsAdmin]=useState(false);
    function handleClick() {
        let temp = isAdmin;
        setIsAdmin(!temp);
    }
        return (
            <View style={{
                display: 'flex',
                alignItems: 'center',
                height: '100vh',
            }}>
                <div style={{ display: "flex" }}>
                    <h1 style={{fontWeight: 'bold'}}>
                        Welcome to IntelliQ
                    </h1>
                </div>
                {!isAdmin? <div >
                        <button style={{display: 'flex', justifyContent: 'right'}} onClick={()=>{handleClick()}}>
                            Sign In as Admin
                        </button>
                </div> :
                    <div>
                        <button variant="contained" style={{float: 'right'}} onClick={()=>{handleClick()}}>
                           Log out
                        </button>
                </div>
                }
                <a href="/current_questionnaire">
                    <button >
                        View Questionnaires
                    </button>
                </a>
                {isAdmin?
                    <div>
                        <a href="/admin_page">
                            <button > View Results </button>
                        </a></div>: null}
            </View>
        )
}