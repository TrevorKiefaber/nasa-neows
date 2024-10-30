// import nasa_data from '../api/nasa_response.json';
'use client'
const _ = require('underscore');
const moment = require('moment');
import { useState, useEffect, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, SetStateAction } from 'react';

export default function GetData(startDate: string | null, endDate: string | null){
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [sortField, setSortField] = useState('datetime');
    const [sortOrder, setSortOrder] = useState(false);

    useEffect(() => {
        let requestString = `https://api.nasa.gov/neo/rest/v1/feed?api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`;
        if(startDate){
            requestString += `&start_date=${startDate}`;
        }
        if(endDate){
            requestString += `&end_date=${endDate}`;
        }
        fetch(requestString)
            .then((res) => res.json())
            .then((json) => {
                setData(json);
                setLoading(false);
            });
    }, [])

    if(isLoading) return (<p>Loading...</p>)

    if(!data) return (<p>No Data</p>)

    let date_keys = Object.keys(data.near_earth_objects);
    let results: any[] = [];
    
    date_keys.forEach((date) => {
        let formatted = data.near_earth_objects[date].map((neo: { close_approach_data: string | any[]; id: any; estimated_diameter: { meters: { estimated_diameter_max: any; estimated_diameter_min: any; }; }; name: any; is_potentially_hazardous_asteroid: any; is_sentry_object: any; absolute_magnitude_h: any; }) => {
            if(neo.close_approach_data.length > 1){
                console.log(`Two results!!!! ${neo.id}`);
            }
            const avg_diam = (neo.estimated_diameter.meters.estimated_diameter_max + neo.estimated_diameter.meters.estimated_diameter_min) / 2;
            return {
                id: neo.id,
                name: neo.name,
                diam: avg_diam,
                hazard: neo.is_potentially_hazardous_asteroid,
                sentry: neo.is_sentry_object,
                velocity: neo.close_approach_data[0].relative_velocity.kilometers_per_hour,
                miss_dist: neo.close_approach_data[0].miss_distance.kilometers,
                magnitude: neo.absolute_magnitude_h,
                datetime: moment(neo.close_approach_data[0].close_approach_date_full),
                readable_datetime: neo.close_approach_data[0].close_approach_date_full
            }
        });
        results = results.concat(formatted);
    });

    // Sort the data
    // let sortedResults = _.sortBy(results, function(res){ return res[sortField] });
    let sortedResults = _.sortBy(results, sortField);
    if(sortOrder) { sortedResults.reverse(); }

    // Return the data as a table
    return (
        <table>
            <thead>
                <tr>
                    <th onClick={() => handleSortChange('id')}>ID</th>
                    <th onClick={() => handleSortChange('name')}>Name</th>
                    <th onClick={() => handleSortChange('diam')}>Estimated Diameter (m)</th>
                    <th onClick={() => handleSortChange('hazard')}>Is Hazardous</th>
                    <th onClick={() => handleSortChange('sentry')}>Is Sentry Object</th>
                    <th onClick={() => handleSortChange('velocity')}>Velocity (km/h)</th>
                    <th onClick={() => handleSortChange('miss_dist')}>Miss Distance (km)</th>
                    <th onClick={() => handleSortChange('magnitude')}>Visual Magnituded</th>
                    <th onClick={() => handleSortChange('datetime')}>Close Approach Datetime</th>
                </tr>
            </thead>
            <tbody key="table_body">
                {sortedResults.map((row: { id: boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | Key | null | undefined; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; diam: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; hazard: any; sentry: any; velocity: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; miss_dist: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; magnitude: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; readable_datetime: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => {
                    return (
                        <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.name}</td>
                            <td>{row.diam}</td>
                            <td>{row.hazard ? "Yes" : "No"}</td>
                            <td>{row.sentry ? "Yes" : "No"}</td>
                            <td>{row.velocity}</td>
                            <td>{row.miss_dist}</td>
                            <td>{row.magnitude}</td>
                            <td>{row.readable_datetime}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    function handleSortChange(column: string){
        if(column === sortField){
            setSortOrder(!sortOrder);
        }else{
            setSortField(column);
            setSortOrder(false);
        }
    }
}