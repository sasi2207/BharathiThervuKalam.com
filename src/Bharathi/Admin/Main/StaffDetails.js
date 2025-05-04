import React from 'react';


const RecentPayments = () => {
    return (
        <div className="recent-payments">
            <div className="title">
                <h2>Recent Payments</h2>
                <a href="#" className="btn">View All</a>
            </div>
            <table>
                <tr>
                    <th>Name</th>
                    <th>School</th>
                    <th>Amount</th>
                    <th>Option</th>
                </tr>
                <tr>
                    <td>John Doe</td>
                    <td>St. James College</td>
                    <td>$120</td>
                    <td><a href="#" className="btn">View</a></td>
                </tr>
                <tr>
                    <td>John Doe</td>
                    <td>St. James College</td>
                    <td>$120</td>
                    <td><a href="#" className="btn">View</a></td>
                </tr>
                <tr>
                    <td>John Doe</td>
                    <td>St. James College</td>
                    <td>$120</td>
                    <td><a href="#" className="btn">View</a></td>
                </tr>
                <tr>
                    <td>John Doe</td>
                    <td>St. James College</td>
                    <td>$120</td>
                    <td><a href="#" className="btn">View</a></td>
                </tr>
                <tr>
                    <td>John Doe</td>
                    <td>St. James College</td>
                    <td>$120</td>
                    <td><a href="#" className="btn">View</a></td>
                </tr>
                <tr>
                    <td>John Doe</td>
                    <td>St. James College</td>
                    <td>$120</td>
                    <td><a href="#" className="btn">View</a></td>
                </tr>
            </table>
        </div>
    );
}

export default RecentPayments;
