import styles from './Project.module.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Loading from '../layout/Loading';
import Container from '../layout/Container';
import ProjectForm from '../project/ProjectForm';
import ServiceForm from '../service/ServiceForm';
import Message from '../layout/Message';
import ServiceCard from '../service/ServiceCard';

const Project = () => {

    const { id } = useParams();

    const [project, setProject] = useState([]);
    const [services, setServices] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [message, setMessage] = useState();
    const [type, setType] = useState();


    useEffect(() => {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(resp => resp.json())
        .then(data => {
            setProject(data)
            setServices(data.services)
        })
        .catch((err) => console.log(err))
    }, [id])

    const editPost = (project) => {
        setMessage('')

        // Budget validation
        if(project.budget < project.cost) {
            setMessage('O orçamento não pode ser inferior ao custo do projeto!')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        })
        .then(resp => resp.json())
        .then(data => {
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto atualizado com sucesso!')
            setType('success')
        })
        .catch((err) => console.log(err))
    }

    const createService = (project) => {
        setMessage('')

        // Last service

        const lastService = project.services[project.services.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        // Maximum value validation
        if(newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço!')
            setType('error')
            project.services.pop()
            return false
        }

        // Add service cost to project total cost
        project.cost = newCost

        // Update project
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            // Show the services
            setShowServiceForm(false)
        })
        .catch((err) => console.log(err))
    }

    const removeService = () => {
        //
    }   

    const toggleProjectForm = () => {
        setShowProjectForm(!showProjectForm);
    }

    const toggleServiceForm = () => {
        setShowServiceForm(!showServiceForm);
    }

    return (
        <>
            { project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        { message && <Message type={type} msg={message} /> }
                        <div className={styles.details_container}>
                            <h1>Projeto: { project.name }</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                { !showProjectForm ? 'Editar projeto' : 'Fechar' }
                            </button>

                            { !showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p><span>Categoria: </span>{ project.category.name }</p>
                                    <p><span>Orçamento: </span>R${ project.budget }</p>
                                    <p><span>Total utilizado: </span>{ project.cost }</p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm handleSubmit={editPost} btnText="Concluir Edição" projectData={project} />
                                </div>
                            ) }
                        </div>

                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço</h2> 

                            <button className={styles.btn} onClick={toggleServiceForm}>
                                { !showServiceForm ? 'Adicionar serviço' : 'Fechar' }
                            </button>  

                            <div className={styles.project_info}>
                                { showServiceForm && (
                                    <ServiceForm 
                                        handleSubmit={createService}
                                        btnText="Adicionar Serviço"
                                        projectData={project}
                                    />
                                ) }
                            </div> 
                        </div>  

                        <h2>Serviços</h2>   

                        {/* Parte defeituosa */}

                        <Container customClass="start">
                            {services.length > 0 &&
                                services.map((service) => (                                    
                                <ServiceCard 
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={removeService}
                                    />
                                ))
                            }
                            {services.length === 0 && <p>Não há serviços cadastrados!</p>}oi
                        </Container>

                    </Container>
                </div>
            ) : (
                <Loading />
            ) }
        </>
    )
}

export default Project;