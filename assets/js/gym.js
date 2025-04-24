document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    if (!localStorage.getItem("scheduleSlots")) {
        const scheduleSlots = {
            "Пн": [{ time: "08:00", spots: 3 }, { time: "10:00", spots: 2 }],
            "Ср": [{ time: "09:00", spots: 1 }],
            "Пт": [{ time: "08:30", spots: 2 }]
        };
        localStorage.setItem("scheduleSlots", JSON.stringify(scheduleSlots));
    }
    const gyms = {
        "1": {
            name: "Фитнес Центр X",
            address: "Алматы, ул. Абая 50",
            category: "Фитнес",
            image: "../assets/images/fitnessPic1.jpg",
            schedule: ["Пн: 08:00–22:00", "Ср: 10:00–21:00", "Пт: 09:00–20:00"]
        },
        "2": {
            name: "Спортзал Y",
            address: "Астана, пр. Назарбаева 10",
            category: "Тренажерный зал",
            image: "../assets/images/gymPic1.jpg",
            schedule: ["Вт: 07:00–20:00", "Чт: 08:00–21:00", "Сб: 09:00–19:00"]
        },
        "3": {
            name: "Йога-центр Lotus",
            address: "Шымкент, ул. Байтурсынова 20",
            category: "Йога",
            image: "../assets/images/yogaPic1.jpg",
            schedule: ["Пн-Сб: 10:00–18:00"]
        },
        "4": {
            name: "Тренажерный зал Z",
            address: "Шымкент, ул. Абая 40",
            category: "Тренажерный зал",
            image: "../assets/images/gymPic2.jpg",
            schedule: ["Пн/Ср/Пт: 10:00–18:00"]
        },
        "5": {
            name: "Бассейн Aqua",
            address: "Алматы, ул. Гоголя 40",
            category: "Плавание",
            image: "../assets/images/swimmingPic1.jpg",
            schedule: ["ВТ/Чт/Сб: 10:00–18:00"]
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const gymId = urlParams.get("id");
    const gym = gyms[gymId];
    
    if (gym) {
        document.getElementById("gym-name").textContent = gym.name;
        document.getElementById("gym-address").textContent = `Адрес: ${gym.address}`;
        document.getElementById("gym-category").textContent = `Категория: ${gym.category}`;
        document.getElementById("gym-image").src = gym.image;

        const scheduleList = document.getElementById("gym-schedule");
        gym.schedule.forEach(time => {
            const li = document.createElement("li");
            li.textContent = time;
            scheduleList.appendChild(li);
        });
        if (user) showUserBookingsForThisGym();
    } else {
        document.getElementById("gym-details").innerHTML = "<p>Зал не найден.</p>";
    }

    //Form
    /*document.getElementById("openModalBtn").onclick = () => {
        document.getElementById("bookingModal").style.display = "block";
    };
    document.getElementById("closeModalBtn").onclick = () => {
        document.getElementById("bookingModal").style.display = "none";
    };
    window.onclick = (e) => {
        if (e.target == document.getElementById("bookingModal")) {
            document.getElementById("bookingModal").style.display = "none";
        }
    }*/
    
    // Обработка формы
   


    //Checking a time in schedule
    const savedSchedule = localStorage.getItem("scheduleSlots");
    let scheduleSlots = savedSchedule
    ? JSON.parse(savedSchedule)
    : {
        "Пн": [
            { time: "08:00", spots: 3 },
            { time: "10:00", spots: 2 }
        ],
        "Ср": [
            { time: "09:00", spots: 1 },
            { time: "11:00", spots: 0 }
        ],
        "Пт": [
            { time: "08:30", spots: 2 },
            { time: "12:00", spots: 0 }
        ]
    };

    let selectedDay = null;
    let selectedTime = null;

    const dayButtonsContainer = document.getElementById("dayButtons");
    const timeButtonsContainer = document.getElementById("timeButtons");

    // 1. Рендер дней
    function renderDays() {
        dayButtonsContainer.innerHTML = "";
        for (let day in scheduleSlots) {
            const btn = document.createElement("button");
            btn.textContent = day;
            btn.className = "day-btn";
            btn.onclick = (e) => {
                e.preventDefault();
                selectedDay = day;
                selectedTime = null;
                document.querySelectorAll(".day-btn").forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                renderTimes(day);
            };
            dayButtonsContainer.appendChild(btn);
        }
    }

    // 2. Рендер времён
    function renderTimes(day) {
        timeButtonsContainer.innerHTML = "";
        scheduleSlots[day].forEach((slot, index) => {
            const btn = document.createElement("button");
            btn.textContent = `${slot.time} (${slot.spots > 0 ? slot.spots + " мест" : "мест нет"})`;
            btn.className = "time-btn";
            btn.classList.add(slot.spots > 0 ? "available" : "unavailable");
            btn.disabled = slot.spots === 0;

            const bookings = JSON.parse(localStorage.getItem("userBookings")) || {};
            const userBookings = user && bookings[user.login] ? bookings[user.login] : [];
            const gymName = document.getElementById("gym-name").textContent;

            const isUserBooked = userBookings.some(
                b => b.gymName === gymName && b.day === day && b.time === slot.time
            );
    
            if (isUserBooked) {
                btn.textContent += " — ваша бронь";
                btn.style.border = "2px solid #6200ea";
            }

            btn.onclick = (e) => {
                e.preventDefault();
                document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                selectedTime = slot.time;
            };
            timeButtonsContainer.appendChild(btn);
        });
    }

    document.getElementById("bookingForm").onsubmit = function (e) {
        e.preventDefault();
    
        if (!selectedDay || !selectedTime) {
            alert("Пожалуйста, выберите день и время.");
            return;
        }
    
        const user = JSON.parse(localStorage.getItem("loggedUser"));
        if (!user) {
            alert("Пожалуйста, войдите, чтобы забронировать.");
            return;
        }
    
        const allBookings = JSON.parse(localStorage.getItem("userBookings")) || {};
        if (!allBookings[user.login]) {
            allBookings[user.login] = [];
        }
    
        // ❗ Проверка на существующую бронь
        const alreadyBooked = allBookings[user.login].some(b =>
            b.gymName === gym.name &&
            b.day === selectedDay &&
            b.time === selectedTime
        );
    
        if (alreadyBooked) {
            alert("Вы уже забронировали это время.");
            return;
        }
    
        // Обновление слота
        scheduleSlots[selectedDay] = scheduleSlots[selectedDay].map(slot => {
            if (slot.time === selectedTime && slot.spots > 0) {
                slot.spots--;
            }
            return slot;
        });
    
        localStorage.setItem("scheduleSlots", JSON.stringify(scheduleSlots));
    
        // Добавление брони
        allBookings[user.login].push({
            gymName: gym.name,
            day: selectedDay,
            time: selectedTime,
            category: gym.category,
        });
    
        localStorage.setItem("userBookings", JSON.stringify(allBookings));
    
        document.getElementById("successMessage").style.display = "block";
        renderTimes(selectedDay);
    
        setTimeout(() => {
            document.getElementById("successMessage").style.display = "none";
        }, 2500);
    
        // Обновление UI
        showUserBookingsForThisGym();
    };
    
    

    function showUserBookingsForThisGym() {
        const allBookings = JSON.parse(localStorage.getItem("userBookings")) || {};
        const bookings = allBookings[user.login] || [];
      
        const currentGymBookings = bookings.filter(b => b.gymName === gym.name);
      
        if (currentGymBookings.length > 0) {
          const container = document.querySelector("#bookingSection");
          const info = document.createElement("div");
          info.style.margin = "20px 0";
          info.style.background = "#f0f0f0";
          info.style.padding = "15px";
          info.style.borderRadius = "8px";
          info.innerHTML = `<strong>Вы уже бронировали:</strong><br>` +
            currentGymBookings.map(b => `📅 ${b.day}, 🕒 ${b.time}`).join("<br>");
          container.prepend(info);
        }
      }
      
    
    
    if (!user) {
        alert("Пожалуйста, войдите, чтобы забронировать.");
        return;
    }
    renderDays();
    showUserBookingsForThisGym()

    

    

    
    

});


