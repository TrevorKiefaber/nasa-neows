'use client'
 
import { useSearchParams } from 'next/navigation'
import nasa_api from './components/nasa_api';
import './styles.css';

export default function Page() {
    const searchParams = useSearchParams()
    const start = searchParams.get('start_date');
    const end = searchParams.get('end_date');
    const nasa_results = nasa_api(start, end);
    return (<>
        <form>
            <label>
                Start Date:
                <input name="start_date" type="date" />
            </label>
            <label>
                End Date:
                <input name="end_date" type="date" />
            </label>
            <button type="submit">Submit</button>
        </form>
        {nasa_results}
    </>)

}