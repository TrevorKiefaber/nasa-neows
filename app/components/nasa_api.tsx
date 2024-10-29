// import nasa_data from '../api/nasa_response.json';

export default async function GetData(startDate, endDate){
    let requestString = `https://api.nasa.gov/neo/rest/v1/feed?api_key=${process.env.NASA_API_KEY}`;
    if(startDate){
        requestString += `&start_date=${startDate}`;
    }
    if(endDate){
        requestString += `&end_date=${endDate}`;
    }
    let req = await fetch(requestString);
    let data = await req.json();

    // let data = nasa_data;

    let date_keys = Object.keys(data.near_earth_objects);
    let results = [];

    date_keys.forEach((date) => {
        let formatted = data.near_earth_objects[date].map((neo) => {
            if(neo.close_approach_data.length > 1){
                console.log(`Two results!!!! ${neo.id}`);
            }
            return {
                id: neo.id,
                name: neo.name,
                diam: neo.estimated_diameter.meters.estimated_diameter_max,
                // diam: neo.estimated_diameter.meters.estimated_diameter_min,
                hazard: neo.is_potentially_hazardous_asteroid,
                sentry: neo.is_sentry_object,
                velocity: neo.close_approach_data[0].relative_velocity.kilometers_per_hour,
                miss_dist: neo.close_approach_data[0].miss_distance.kilometers,
                visual_mag: neo.absolute_magnitude_h,
                close_approach_time: neo.close_approach_data[0].close_approach_date_full
            };
        });
        results = results.concat(formatted);
    });

    return results;
}