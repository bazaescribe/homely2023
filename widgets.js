function getFormattedDate(date) {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const day = days[date.getDay()]; // Obtenemos las dos primeras letras del día
  
    const dateNum = date.getDate();
  
    return { day, dateNum }; // Devolvemos un objeto con las propiedades day y dateNum
  }

function validateDays(currentDate) {
    const today = parseInt(currentDate.getDay());
    const time = currentDate.getHours() * 60 + currentDate.getMinutes();
    const tomorrow = today + 1;
    const afterTomorrow = today + 2;
    
    var blockedDays = [0];

    if (time > 840) {
        blockedDays.push(tomorrow);
        blockedDays.push(afterTomorrow);
    } else{
        blockedDays.push(tomorrow);
    }

    return(blockedDays);
}
  
function createDays() {
    const container = document.getElementById('day-list');
    const currentDate = new Date();

    // Agregar el nombre del mes y el año al div #month
    const monthDiv = document.getElementById('month');
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    monthDiv.textContent = `${monthName} ${year}`;
  
    // const blockedDays = [0, 3, 4]; // Días de la semana a bloquear

    const blockedDays = validateDays(currentDate);
  
    for (let i = 0; i < 7; i++) {
      const radioDate = new Date();
      radioDate.setDate(currentDate.getDate() + i + 1);
  
      const { day, dateNum } = getFormattedDate(radioDate);
  
      const dayContainer = document.createElement('div');
      dayContainer.classList.add('day-container');
  
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'dates';
      radio.value = radioDate.toISOString();
  
      // Verificar si el día de la semana está bloqueado y establecer la propiedad 'disabled'
      if (blockedDays.includes(radioDate.getDay())) {
        radio.disabled = true;
        dayContainer.classList.add('disabled'); // Agregar la clase .disabled a los radios desactivados
      }
  
      const label = document.createElement('label');
      label.textContent = day;
      label.classList.add('name');
  
      const dateLabel = document.createElement('label');
      dateLabel.textContent = dateNum;
      dateLabel.classList.add('date');
  
      dayContainer.appendChild(radio);
      dayContainer.appendChild(label);
      dayContainer.appendChild(dateLabel);
  
      dayContainer.addEventListener('click', () => {
        // Verificar si el radio está desactivado y no realizar cambios de estilo
        if (!radio.disabled) {
            radio.checked = !radio.checked;
            if (radio.checked) {
                document.querySelectorAll('.day-container').forEach((container) => {
                if (container !== dayContainer) {
                    container.classList.remove('checked');
                }
                });
                dayContainer.classList.add('checked');
            } else {
                dayContainer.classList.remove('checked');
            }

            if (radio.checked) {
                const dateSelected = new Date(radio.value);
                showAvailability(dateSelected);
            }
        }
      });
  
      container.appendChild(dayContainer);
    }
  }


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function checkAvailability(selectedDate) {
    // Formatear la fecha seleccionada al formato "YYYY-MM-DD"
    const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

    // Devolver una promesa para cargar el contenido del archivo availability.json
    return new Promise((resolve, reject) => {
        fetch('availability.json')
        .then((response) => response.json())
        .then((data) => {
            // Obtener la información de la fecha seleccionada
            const dateInfo = data[formattedDate];
            if (dateInfo) {
            // Devolver el objeto con la información del día seleccionado
            resolve({
                date: selectedDate.toLocaleDateString(),
                shifts: dateInfo.shifts
            });
            } else {
            // Si no hay información para la fecha seleccionada, devolver un objeto vacío
            resolve({});
            }
        })
        .catch((error) => {
            // Si ocurre un error al cargar el archivo, rechazar la promesa con el error
            reject(error);
        });
    });
}
  
function showAvailability(dateSelected) {
    const container = document.getElementById('availability-list');

    container.innerHTML = '';
  
    // Llamar a la función checkAvailability y manejar la promesa resultante
    checkAvailability(dateSelected)
      .then((availability) => {
        console.log(availability);
        // Aquí puedes hacer lo que desees con el objeto 'availability' que contiene la información del día seleccionado
        const availabilityContainer = document.createElement('div');
  
        // Turno de la mañana
        const morningKeepersAvailable = availability.shifts.morning.available;
        const morningAvailableLabel = document.createElement('p');
        const morningShiftContainer = document.createElement('div');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'shift';
        radio.value = "morning";
        const label = "Turno matutino";
        const detailsLabel = "De 8:00 AM a 12:00 PM"

        morningShiftContainer.appendChild(radio);
        morningShiftContainer.append(label);
        morningShiftContainer.append(detailsLabel);
        morningAvailableLabel.textContent = `Keepers disponibles en la mañana: ${morningKeepersAvailable}`;
  
        shiftContainer.appendChild(morningAvailableLabel);
        shiftContainer.appendChild(afternoonAvailableLabel);
        shiftContainer.appendChild(fullTimeAvailableLabel);
        container.appendChild(morningShiftContainer);
        
        // // Turno de la tarde
        // const afternoonKeepersAvailable = availability.shifts.afternoon.available;
        // const afternoonAvailableLabel = document.createElement('p');
        // afternoonAvailableLabel.textContent = `Keepers disponibles en la tarde: ${afternoonKeepersAvailable}`;
  
        // // Turno de tiempo completo
        // const fullTimeKeepersAvailable = availability.shifts['full-time'].available;
        // const fullTimeAvailableLabel = document.createElement('p');
        // fullTimeAvailableLabel.textContent = `Keepers disponibles en tiempo completo: ${fullTimeKeepersAvailable}`;
  

      })
      .catch((error) => {
        console.error('Error al obtener la información del día seleccionado:', error);
        container.textContent = "No hay keepers disponibles para la fecha seleccionada";
      });
  }