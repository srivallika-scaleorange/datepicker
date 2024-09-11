// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import './date.css'
// import dayjs from "dayjs";

// function DateComponent({ foodtype }) {
//     const [selectedDates, setSelectedDates] = useState([]);
//     const [monthlyIncludedDays, setMonthlyIncludedDays] = useState({});
//     const [individualToggles, setIndividualToggles] = useState({});
//     const [currentMonth, setCurrentMonth] = useState(new Date());
//     const [dragStart, setDragStart] = useState(null);
//     const [dragEnd, setDragEnd] = useState(null);
//     const [isDragging, setIsDragging] = useState(false);

//     const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     const currentDate = new Date();

//     useEffect(() => {
//         updateSelectedDates();
//     }, [monthlyIncludedDays, individualToggles, dragStart, dragEnd]);

//     const updateSelectedDates = () => {
//         const allSelectedDates = Object.entries(individualToggles)
//             .filter(([dateStr, isSelected]) => isSelected && new Date(dateStr) >= currentDate)
//             .map(([dateStr]) => new Date(dateStr));

//         if (dragStart && dragEnd) {
//             const dragRange = generateDateRange(dragStart, dragEnd);
//             dragRange.forEach(date => {
//                 if (date >= currentDate && !allSelectedDates.some(d => d.toDateString() === date.toDateString())) {
//                     allSelectedDates.push(date);
//                 }
//             });
//         }

//         setSelectedDates(allSelectedDates);
//     };

//     const handleDateClick = (date) => {
//         if (date < currentDate) return;
//         const dateStr = date.toDateString();
//         const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
//         const dayOfWeek = date.getDay();

//         setIndividualToggles(prev => {
//             const newToggles = { ...prev };
//             newToggles[dateStr] = !newToggles[dateStr];
//             return newToggles;
//         });

//         setMonthlyIncludedDays(prev => {
//             const currentMonthDays = prev[monthKey] || {};
//             return {
//                 ...prev,
//                 [monthKey]: {
//                     ...currentMonthDays,
//                     [dayOfWeek]: true
//                 }
//             };
//         });
//     };

//     const handleDragStart = (date) => {
//         if (date < currentDate) return;
//         setDragStart(date);
//         setDragEnd(null);
//         setIsDragging(true);
//     };

//     const handleDragEnter = (date) => {
//         if (isDragging && date >= currentDate) {
//             setDragEnd(date);
//         }
//     };

//     const handleDragEnd = () => {
//         if (dragStart && dragEnd) {
//             const dragRange = generateDateRange(dragStart, dragEnd);
//             const newToggles = { ...individualToggles };
//             const newMonthlyIncludedDays = { ...monthlyIncludedDays };

//             dragRange.forEach(date => {
//                 if (date >= currentDate) {
//                     const dateStr = date.toDateString();
//                     newToggles[dateStr] = true;

//                     const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
//                     const dayOfWeek = date.getDay();
//                     if (!newMonthlyIncludedDays[monthKey]) {
//                         newMonthlyIncludedDays[monthKey] = {};
//                     }
//                     newMonthlyIncludedDays[monthKey][dayOfWeek] = true;
//                 }
//             });

//             setIndividualToggles(newToggles);
//             setMonthlyIncludedDays(newMonthlyIncludedDays);
//         }
//         setDragStart(null);
//         setDragEnd(null);
//         setIsDragging(false);
//     };

//     const generateDateRange = (start, end) => {
//         let dates = [];
//         let currentDate = new Date(Math.min(start, end));
//         const endDate = new Date(Math.max(start, end));
//         while (currentDate <= endDate) {
//             dates.push(new Date(currentDate));
//             currentDate.setDate(currentDate.getDate() + 1);
//         }
//         return dates;
//     };

//     const dayClassName = (date) => {
//         if (date < currentDate) return "disabled-day";

//         const dateStr = date.toDateString();
//         return individualToggles[dateStr] ? "selected-day" : "default-day";
//     };

//     const handleIncludeDayChange = (day) => {
//         const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
//         const newValue = !monthlyIncludedDays[monthKey]?.[day];

//         setMonthlyIncludedDays(prev => ({
//             ...prev,
//             [monthKey]: {
//                 ...(prev[monthKey] || {}),
//                 [day]: newValue
//             }
//         }));

//         setIndividualToggles(prev => {
//             const newToggles = { ...prev };
//             const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
//             const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

//             for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
//                 if (d.getDay() === day && d >= currentDate) {
//                     const dateStr = d.toDateString();
//                     newToggles[dateStr] = newValue;
//                 }
//             }
//             return newToggles;
//         });
//     };

//     const handleSaveDates = () => {
//         const dates = selectedDates;
//         console.log("Saved successfully:", { foodtype, dates });
//     };

//     const handleclear = () => {
//         setSelectedDates([]);
//         setIndividualToggles({});
//         setDragStart(null);
//         setDragEnd(null);
//         setIsDragging(false);
//         setMonthlyIncludedDays({});
//     };

//     const renderCustomHeader = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
//         <div style={{ margin: '5px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '5px' }}>
//                 <button
//                     className="bold-arrow-left"
//                     onClick={() => {
//                         decreaseMonth();
//                         setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1));
//                     }}
//                     disabled={prevMonthButtonDisabled}
//                 >
//                     {"<"}
//                 </button>
//                 <div className="bold-text2">{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
//                 <button
//                     className="bold-arrow-right"
//                     onClick={() => {
//                         increaseMonth();
//                         setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1));
//                     }}
//                     disabled={nextMonthButtonDisabled}
//                 >
//                     {">"}
//                 </button>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', fontSize: '0.8em' }}>
//                 {weekdays.map((day, index) => (
//                     <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                         <input
//                             type="checkbox"
//                             id={`include-${day}`}
//                             checked={monthlyIncludedDays[`${currentMonth.getFullYear()}-${currentMonth.getMonth()}`]?.[index] || false}
//                             onChange={() => handleIncludeDayChange(index)}
//                             style={{ margin: '0 0 2px 0', width: '12px', height: '12px', margin: '7px' }}
//                         />
//                         <label
//                             htmlFor={`include-${day}`}
//                             className={`bold-label ${index === 0 || index === 6 ? 'weekend' : ''}`}
//                         >
//                             {day}
//                         </label>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );

//     return (
//         <div className="container">
//             <div className="calendar-container">
//                 <DatePicker
//                     selected={null}
//                     onChange={() => { }}
//                     onSelect={handleDateClick}
//                     inline
//                     dayClassName={dayClassName}
//                     dateFormat="dd/MM/yyyy"
//                     renderCustomHeader={renderCustomHeader}
//                     renderDayContents={(day, date) => (
//                         <div className="datepicker bold-text"
//                             onMouseDown={() => handleDragStart(date)}
//                             onMouseEnter={() => handleDragEnter(date)}
//                             onMouseUp={handleDragEnd}
//                         >
//                             {day}
//                         </div>
//                     )}
//                     minDate={currentDate}
//                 />
//                 <div className="selected-container">
//                     <div>
//                         <p className="days">Chosen Dining Days: {selectedDates.length}</p>
//                     </div>
//                     <div>
//                         <button className="btn" onClick={handleSaveDates}>Save</button>
//                     </div>
//                     <div>
//                         <button className="btn" onClick={handleclear}>Clear</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default DateComponent;

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './date.css'
import dayjs from "dayjs";

function DateComponent({ foodtype }) {
    const [selectedDates, setSelectedDates] = useState([]);
    const [monthlyIncludedDays, setMonthlyIncludedDays] = useState({});
    const [individualToggles, setIndividualToggles] = useState({});
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [dragStart, setDragStart] = useState(null);
    const [dragEnd, setDragEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate = new Date();

    useEffect(() => {
        updateSelectedDates();
    }, [monthlyIncludedDays, individualToggles, dragStart, dragEnd]);

    const updateSelectedDates = () => {
        const allSelectedDates = Object.entries(individualToggles)
            .filter(([dateStr, isSelected]) => isSelected && new Date(dateStr) >= currentDate)
            .map(([dateStr]) => new Date(dateStr));

        if (dragStart && dragEnd) {
            const dragRange = generateDateRange(dragStart, dragEnd);
            dragRange.forEach(date => {
                if (date >= currentDate && !allSelectedDates.some(d => d.toDateString() === date.toDateString())) {
                    allSelectedDates.push(date);
                }
            });
        }

        setSelectedDates(allSelectedDates);
    };

    const handleDateClick = (date) => {
        if (date < currentDate) return;
        const dateStr = date.toDateString();
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const dayOfWeek = date.getDay();

        setIndividualToggles(prev => {
            const newToggles = { ...prev };
            newToggles[dateStr] = !newToggles[dateStr];
            return newToggles;
        });

        setMonthlyIncludedDays(prev => {
            const currentMonthDays = prev[monthKey] || {};
            return {
                ...prev,
                [monthKey]: {
                    ...currentMonthDays,
                    [dayOfWeek]: true
                }
            };
        });
    };

    const handleDragStart = (date) => {
        if (date < currentDate) return;
        setDragStart(date);
        setDragEnd(null);
        setIsDragging(true);
    };

    const handleDragEnter = (date) => {
        if (isDragging && date >= currentDate) {
            setDragEnd(date);
        }
    };

    const handleDragEnd = () => {
        if (dragStart && dragEnd) {
            const dragRange = generateDateRange(dragStart, dragEnd);
            const newToggles = { ...individualToggles };
            const newMonthlyIncludedDays = { ...monthlyIncludedDays };

            dragRange.forEach(date => {
                if (date >= currentDate) {
                    const dateStr = date.toDateString();
                    newToggles[dateStr] = true;

                    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
                    const dayOfWeek = date.getDay();
                    if (!newMonthlyIncludedDays[monthKey]) {
                        newMonthlyIncludedDays[monthKey] = {};
                    }
                    newMonthlyIncludedDays[monthKey][dayOfWeek] = true;
                }
            });

            setIndividualToggles(newToggles);
            setMonthlyIncludedDays(newMonthlyIncludedDays);
        }
        setDragStart(null);
        setDragEnd(null);
        setIsDragging(false);
    };

    const generateDateRange = (start, end) => {
        let dates = [];
        let currentDate = new Date(Math.min(start, end));
        const endDate = new Date(Math.max(start, end));
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const dayClassName = (date) => {
        if (date < currentDate) return "disabled-day";

        const dateStr = date.toDateString();
        return individualToggles[dateStr] ? "selected-day" : "default-day";
    };

    const handleIncludeDayChange = (day) => {
        const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
        const newValue = !monthlyIncludedDays[monthKey]?.[day];

        setMonthlyIncludedDays(prev => ({
            ...prev,
            [monthKey]: {
                ...(prev[monthKey] || {}),
                [day]: newValue
            }
        }));

        setIndividualToggles(prev => {
            const newToggles = { ...prev };
            const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

            for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
                if (d.getDay() === day && d >= currentDate) {
                    const dateStr = d.toDateString();
                    newToggles[dateStr] = newValue;
                }
            }
            return newToggles;
        });
    };

    const handleSaveDates = () => {
        const dates = selectedDates;
        console.log("Saved successfully:", { foodtype, dates });
    };

    const handleclear = () => {
        setSelectedDates([]);
        setIndividualToggles({});
        setDragStart(null);
        setDragEnd(null);
        setIsDragging(false);
        setMonthlyIncludedDays({});
    };

    const renderCustomHeader = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
        <div style={{ margin: '5px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '5px' }}>
                <button
                    className="bold-arrow-left"
                    onClick={() => {
                        decreaseMonth();
                        setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1));
                    }}
                    disabled={prevMonthButtonDisabled}
                >
                    {"<"}
                </button>
                <div className="bold-text2">{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                <button
                    className="bold-arrow-right"
                    onClick={() => {
                        increaseMonth();
                        setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1));
                    }}
                    disabled={nextMonthButtonDisabled}
                >
                    {">"}
                </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', fontSize: '0.8em' }}>
                {weekdays.map((day, index) => (
                    <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            id={`include-${day}`}
                            checked={monthlyIncludedDays[`${currentMonth.getFullYear()}-${currentMonth.getMonth()}`]?.[index] || false}
                            onChange={() => handleIncludeDayChange(index)}
                            style={{ margin: '0 0 2px 0', width: '12px', height: '12px', margin: '7px' }}
                        />
                        <label
                            htmlFor={`include-${day}`}
                            className={`bold-label ${index === 0 || index === 6 ? 'weekend' : ''}`}
                        >
                            {day}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    // New touch event handlers
    const handleTouchStart = (date) => {
        handleDragStart(date);
    };

    const handleTouchMove = (e, date) => {
        e.preventDefault(); // Prevent scrolling while dragging
        handleDragEnter(date);
    };

    const handleTouchEnd = () => {
        handleDragEnd();
    };

    return (
        <div className="container">
            <div className="calendar-container">
                <DatePicker
                    selected={null}
                    onChange={() => { }}
                    onSelect={handleDateClick}
                    inline
                    dayClassName={dayClassName}
                    dateFormat="dd/MM/yyyy"
                    renderCustomHeader={renderCustomHeader}
                    renderDayContents={(day, date) => (
                        <div className="datepicker bold-text"
                            onMouseDown={() => handleDragStart(date)}
                            onMouseEnter={() => handleDragEnter(date)}
                            onMouseUp={handleDragEnd}
                            onTouchStart={() => handleTouchStart(date)}
                            onTouchMove={(e) => handleTouchMove(e, date)}
                            onTouchEnd={handleTouchEnd}
                        >
                            {day}
                        </div>
                    )}
                    minDate={currentDate}
                />
                <div className="selected-container">
                    <div>
                        <p className="days">Chosen Dining Days: {selectedDates.length}</p>
                    </div>
                    <div>
                        <button className="btn" onClick={handleSaveDates}>Save</button>
                    </div>
                    <div>
                        <button className="btn" onClick={handleclear}>Clear</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DateComponent;