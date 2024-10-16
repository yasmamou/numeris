import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Project } from '../types/Project';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentUser) return;

      const q = query(collection(db, "projects"), where("participants", "array-contains", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const fetchedProjects: Project[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProjects.push({ id: doc.id, ...doc.data() } as Project);
      });
      setProjects(fetchedProjects);
    };

    fetchProjects();
  }, [currentUser]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tableau de bord</h2>
      <p className="mb-4">Bienvenue, {currentUser?.email}</p>
      <Link to="/create-project" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Créer un nouveau projet
      </Link>
      <h3 className="text-xl font-semibold mt-8 mb-4">Vos projets</h3>
      {projects.length === 0 ? (
        <p>Vous n'avez pas encore de projets.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id} className="border p-4 rounded-lg">
              <h4 className="text-lg font-semibold">{project.title}</h4>
              <p className="text-gray-600">{project.description}</p>
              <p className="text-sm text-gray-500 mt-2">Status: {project.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;