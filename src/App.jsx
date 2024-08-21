import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [sugarName, setSugarName] = useState('');
  const [sugarList, setSugarList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSugarList();
  }, []);

  const fetchSugarList = async () => {
    try {
      const response = await fetch('https://sugar-list.vercel.app/api/v1/sugar');
      const data = await response.json();
      setSugarList(data.sugar || []);
    } catch (error) {
      console.error('Error fetching sugar list:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!sugarName.trim()) {
      setError('Sugar Name is required');
      return;
    }

    try {
      const response = await fetch('https://sugar-list.vercel.app/api/v1/sugar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: sugarName }),
      });

      if (response.ok) {
        fetchSugarList();
        setSugarName('');
        setError('');
        document.getElementById('my_modal_5').close();
      } else {
        setError('Failed to add sugar name');
      }
    } catch (error) {
      console.error('Error adding sugar name:', error);
      setError('Failed to add sugar name');
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this item?");
    if (isConfirmed) {
      try {
        const response = await fetch(`https://sugar-list.vercel.app/api/v1/sugar/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSugarList(sugarList.filter(sugar => sugar._id !== id));
          alert("Item successfully deleted.");
        } else {
          console.error('Failed to delete the item');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center my-6">Sugar List</h1>
      <div className="w-full max-w-4xl flex justify-end p-4">
        <button 
          className="btn" 
          onClick={() => document.getElementById('my_modal_5').showModal()}
        >
         Add
        </button>
      </div>

      <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {sugarList.map((sugar, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{sugar.name}</td>
                <td className="px-4 py-2">
                  <button 
                    className="btn btn-error" 
                    onClick={() => handleDelete(sugar._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="my_modal_5" className="modal">
        <form method="dialog" className="modal-box" onSubmit={handleSubmit}>
          <h3 className="font-bold text-lg">Enter Sugar Name</h3>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Sugar Name</span>
            </label>
            <input 
              type="text" 
              placeholder="Type here" 
              className={`input input-bordered w-full max-w-xs ${error ? 'input-error' : ''}`} 
              value={sugarName}
              onChange={(e) => setSugarName(e.target.value)}
            />
            {error && <span className="text-red-500 text-sm">{error}</span>}
          </div>
          <div className="modal-action">
            <button type="submit" className="btn">Submit</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

export default App;
