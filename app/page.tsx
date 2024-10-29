import nasa_api from './components/nasa_api';

export default async function Page() {
    const data = await nasa_api("2024-10-28", "2024-10-29");
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Estimated Diameter (m)</th>
                    <th>Is Hazardous</th>
                    <th>Is Sentry Object</th>
                    <th>Velocity (km/h)</th>
                    <th>Miss Distance (km)</th>
                    <th>Visual Magnituded</th>
                    <th>Close Approach Datetime</th>
                </tr>
            </thead>
            <tbody key="table_body">
                {data.map((neo) => {
                    return (
                        <tr>
                            <td>{neo.id}</td>
                            <td>{neo.name}</td>
                            <td>{neo.diam}</td>
                            <td>{neo.hazard ? "Yes" : "No"}</td>
                            <td>{neo.sentry ? "Yes" : "No"}</td>
                            <td>{neo.velocity}</td>
                            <td>{neo.miss_dist}</td>
                            <td>{neo.visual_mag}</td>
                            <td>{neo.close_approach_time}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}