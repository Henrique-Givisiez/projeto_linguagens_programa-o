import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './home.css';
import DeviceButton from '../components/deviceButton';
import LockButton from '../components/lockButton';
import DropdownMenu from '../components/dropDownMenu'

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [devicesStatus, setDevicesStatus] = useState(location.state?.devicesStatus || {
    luz: false,
    tranca: false,
    alarme: false,
    cortinas: false,
    robo: false,
    cafeteira: false,
    ar_condicionado: false,
    aquecedor: false,
    caixa_de_som: false,
    televisao: false,
  });
  const [lockStatus, setLockStatus] = useState({
    luz: false,
    tranca: false,
    alarme: false,
    cortinas: false,
    robo: false,
    cafeteira: false,
    ar_condicionado: false,
    aquecedor: false,
    caixa_de_som: false,
    televisao: false,
  });
  const [horaAtual, setHoraAtual] = useState(location.state?.hora_atual || 0);
  const [tempAtual, setTempAtual] = useState(location.state?.temp_atual || 12);
  const [precAtual,setPrecAtual] = useState(location.state?.prec_atual || 0);

  const deviceOrder = ['luz', 'tranca', 'alarme', 'cortinas', 'robo', 'cafeteira', 'ar_condicionado', 'aquecedor', 'caixa_de_som', 'televisao'];

  useEffect(() => {
    if (!location.state) {
      navigate('/');
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/api/data');
        const data = await response.json();
        console.log('Dados recebidos:', data); // Log para verificar a resposta
        setDevicesStatus(data.devices_status);
        setHoraAtual(data.hora_atual);
        setTempAtual(data.temp_atual);
        setPrecAtual(data.prec_atual);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData(); // Chamada inicial para buscar os dados assim que o componente monta
    const interval = setInterval(fetchData, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo quando o componente desmonta
  }, [location, navigate]);

  if (!location.state) {
    return null; // ou renderize um carregando enquanto redireciona
  }

  const toggleDevice = async (device) => {
    const updatedStatus = !devicesStatus[device];

    try {
      const response = await fetch('http://127.0.0.1:8080/api/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [device]: updatedStatus }),
      });

      const data = await response.json();
      setDevicesStatus(data);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };


  const toggleLock = async (device) => {
    const updatedLockStatus = !lockStatus[device];

    try {
      const response = await fetch('http://127.0.0.1:8080/api/lock_device', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [`lock_${device}`]: updatedLockStatus }),
      });

      const data = await response.json();
      setLockStatus(data);
    } catch (error) {
      console.error('Erro ao atualizar status de bloqueio:', error);
    }
  };

  const handleModeChange = async (mode) => {
    try {
      const response = await fetch('http://127.0.0.1:8080/api/set_mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modo: mode }),
      });


      const data = await response.json();
      setDevicesStatus(data);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  
  

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authenticated: true }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/');
      } else {
        console.error('Erro ao realizar logout:', data.message);
      }
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  };

  return (
    <div className="body">
      <div className="container">
        <div className="home-container-header">
          <div className='hour-temp-div'>
            <div className='hour-div'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
              </svg>
              <p>{horaAtual.toString().padStart(2,'0')}:00</p>
            </div>
            <div className='temp-div'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-thermometer-half" viewBox="0 0 16 16">
                <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V6.5a.5.5 0 0 1 1 0v4.585a1.5 1.5 0 0 1 1 1.415"/>
                <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1"/>
              </svg>
              <p>{tempAtual.toFixed(0)} °C</p>
            </div>
            <div className='prec-div'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-drizzle" viewBox="0 0 16 16">
              <path d="M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317m6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317m-3.5 1.5a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317m6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317m.747-8.498a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 11H13a3 3 0 0 0 .405-5.973M8.5 2a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4 4 0 0 1 8.5 2"/>
            </svg>
               <p>{precAtual} mm</p>
            </div>
            <div>
              
            </div>
          </div>
          <svg id="house-svg-home" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
          </svg>
          <div className='buttons-header'>
          <DropdownMenu handleModeChange={handleModeChange} />
          <button className='logout-div' onClick = {handleLogout}>
            <p>SAIR DE CASA</p>
          </button>
          </div>
        </div>
        <div className="devices-grid">
          {deviceOrder.map((device) => (
            <div key={device} className="device-container">
              <LockButton
                name={device}
                isLocked={lockStatus[device]}
                toggleLock={toggleLock}
              />
              <DeviceButton
                name={device}
                isActive={devicesStatus[device]}
                isLocked={lockStatus[device]}
                toggleDevice={toggleDevice}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
