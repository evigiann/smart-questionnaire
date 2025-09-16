import React, { Component } from "react";
import {View} from 'react-native';

export default class AdminHomepage extends Component {

    render() {
        return (
            <View >
                <div style={{ display: "flex" }}>
                    <h1 style={{fontWeight: 'bold'}}>
                        Welcome to IntelliQ
                    </h1>
                </div>
                <a href="/questionnaires_page">
                    <button >
                        View Questionnaires
                    </button>
                </a>
                <a href="/admin_page">
                    <button >
                        View Results
                    </button>
                </a>
                <div>
                    <a href="/">
                        <button style={{justifyContent: 'right'}}>
                            Sign Out
                        </button>
                    </a>
                </div>
            </View>

        );
    }
}