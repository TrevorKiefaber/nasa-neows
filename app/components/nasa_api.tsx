// import nasa_data from '../api/nasa_response.json';
'use client'
const _ = require('underscore');
const moment = require('moment');
import { useState, useEffect } from 'react';

export default function GetData(startDate: string | null, endDate: string | null, textSearch: string | null){
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
                velocity: parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour),
                miss_dist: parseFloat(neo.close_approach_data[0].miss_distance.kilometers),
                magnitude: parseFloat(neo.absolute_magnitude_h),
                datetime: moment(neo.close_approach_data[0].close_approach_date_full, 'YYYY-MMM-DD HH:mm'),
                readable_datetime: neo.close_approach_data[0].close_approach_date_full
            }
        });
        results = results.concat(formatted);
    });

    // Filter the data using the textSearch
    let filteredResults = _.filter(results, function(res: any){
        if(textSearch){
            if(res.name.toLowerCase().includes(textSearch.toLowerCase())){
                return true;
            }else{
                return false;
            }
        }else{
            return true;
        }
    })

    // Sort the data
    let sortedResults = _.sortBy(filteredResults, sortField);
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
                    <th onClick={() => handleSortChange('magnitude')}>Visual Magnitude</th>
                    <th onClick={() => handleSortChange('datetime')}>Close Approach Datetime</th>
                </tr>
            </thead>
            <tbody key="table_body">
                {sortedResults.map((row: { id: string; name: string; diam: number; hazard: boolean; sentry: boolean; velocity: string; miss_dist: string; magnitude: number; readable_datetime: string; }) => {
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