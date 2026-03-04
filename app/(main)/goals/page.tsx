
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { getGoalsByOwner, addGoal, Goal } from '../../../lib/goalsService';
import GoalCard from '../../../components/goal/GoalCard';
import GoalForm from '../../../components/goal/GoalForm';
import styles from '../../../styles/GoalsPage.module.css';

const GoalsPage = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGoals = async () => {
    if (user) {
      const userGoals = await getGoalsByOwner(user.uid);
      setGoals(userGoals);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'uid'>) => {
    if (user) {
      await addGoal({ ...goalData, uid: user.uid });
      fetchGoals();
      handleCloseModal();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Minhas Metas</h1>
        <button onClick={handleOpenModal} className={styles.addButton}>+ Adicionar Nova Meta</button>
      </div>
      <div className={styles.goalsGrid}>
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onGoalUpdate={fetchGoals} />
        ))}
      </div>

      {isModalOpen && (
        <GoalForm 
          onClose={handleCloseModal} 
          onSave={handleSaveGoal} 
        />
      )}
    </div>
  );
};

export default GoalsPage;
