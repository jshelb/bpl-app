'use client'

import React, { useEffect, useState } from 'react';
import { RingLoader } from 'react-spinners';

const SchedulePage: React.FC = () => {
  const [numWeeks, setNumWeeks] = useState<number>(0);
  const [numGroups, setNumGroups] = useState<number>(0);
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(true);

  useEffect(() => {
    const fetchExistingSchedule = async () => {
      try {
        setSaved(true);
        const response = await fetch('/api/get_schedule');

        if (response.ok) {
          const data = await response.json();
          setScheduleData(data);
        } else {
          throw new Error(`Previous schedule not wound. Status: ${response.status}`);
        }

        console.log("schedule data fetched successfully");
      } catch (error) {
        console.error('Error fetching existing schedule:', error);
      }
    };

    fetchExistingSchedule();
    // renderScheduleTable();
  }, []); // Run only once on component mount

  const handleGenerateSchedule = async () => {
    try {
      setLoading(true);
      // Send a POST request to the specified API endpoint using fetch
      const response = await fetch('/api/generate_schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ num_weeks: numWeeks, num_groups: numGroups }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate schedule. Status: ${response.status}`);
      }

      // Handle successful schedule generation
      const data = await response.json();
      setScheduleData(data.scheduleData);
      setSaved(false);
    } catch (error) {
      console.error('Error generating schedule:', error);
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  const handleSaveSchedule = async () => {
    try {
      console.log("attempting to save schedule");
      // Send a POST request to the specified API endpoint using fetch
      const response = await fetch('/api/save_schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save schedule. Status: ${response.status}`);
      }
      setSaved(true);
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const renderScheduleTable = () => {
    if (loading) {
      // Return a loading animation while fetching data
      return (
        <div className="flex justify-center items-center pt-10">
          <RingLoader size={150} color="#4CAF50" loading={loading} />
        </div>
      );
    }
    if (!scheduleData) {
      return <p className="text-gray-500 mb-4 mx-4">No schedule exists already. Input valid numbers to generate a new schedule</p>;
    }

    return (
      <div>
        {!saved && <p className="text-gray-500 mb-4 mx-4">Existing schedule shown below, click save schedule button to save</p>}
        {saved && <p className="text-gray-500 mb-4 mx-4">Schedule saved, it will be here when you come back :)</p>}
        <table className="border-collapse border w-full">
        <thead>
          <tr className="">
            <th className="p-2">Week</th>
            {scheduleData.schedule[0].groups.map((group: any) => (
              <th key={group.group} className="p-2 border border-gray-300">
                Group {group.group}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scheduleData.schedule.map((week: any) => (
            <tr key={week.week} className="border border-gray-300">
              <td className="p-2 border-r border-gray-300">{week.week}</td>
              {week.groups.map((group: any) => (
                <td key={group.group} className="p-2 border-r border-gray-300">
                  {group.teams.map((team: string) => (
                    <div key={team}>{team}</div>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Scheduling Tool</h2>

      <div className="flex space-x-4 mb-4">
        <div className="flex flex-row items-center">
          <label className="text-white px-4">Number of Weeks:</label>
          <input 
            type="number" 
            value={numWeeks} 
            onChange={(e) => setNumWeeks(parseInt(e.target.value, 10))} 
            className="p-2 rounded-md bg-gray-800 text-white w-20"
            min="1"
            max="20"
          />
        </div>

        <div className="flex flex-row items-center">
          <label className="text-white px-4">Number of Groups:</label>
          <input 
            type="number" 
            value={numGroups} 
            onChange={(e) => setNumGroups(parseInt(e.target.value, 10))} 
            className="p-2 rounded-md bg-gray-800 text-white w-20"
            min="1"
            max="20"
          />
        </div>

        <button 
          onClick={handleGenerateSchedule}
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md focus:outline-none">
          Generate New Schedule
        </button> 
        {!saved && 
        <button 
          onClick={handleSaveSchedule}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md focus:outline-none ml-auto">
          Save Schedule
        </button>}
        
      </div>

      {renderScheduleTable()}
    </div>

  );
};

export default SchedulePage;
