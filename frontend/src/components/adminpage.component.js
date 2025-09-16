import React, { Component } from "react";

export default class AdminPage extends Component {
    render() {
        return (
            <div>
                <a href="/">
                    <button>Back to Homepage</button>
                </a>
                <p>Select view mode</p>

                <a href="/admin_page_questionnaire">
                    <button>
                        View Results in Questionnaire
                    </button>
                </a>
                <a href="/admin_page_session">
                    <button>
                        View Results in Session
                    </button>
                </a>
            </div>
        )
    };
}