import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBarChart2, FiPackage, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  const { categories } = useOutletContext(); // Access categories from App context
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const stats = [
    { title: 'Total Inventory', value: '1,200', icon: <FiPackage size={24} />, color: 'bg-blue-500' },
    { title: 'Today\'s Revenue', value: '₹5,000', icon: <FiDollarSign size={24} />, color: 'bg-green-500' },
    { title: 'Monthly Growth', value: '+12%', icon: <FiTrendingUp size={24} />, color: 'bg-purple-500' }
  ];

  return (
    <div className="p-6 h-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        initial="hidden"
        animate={isLoading ? "hidden" : "visible"}
        variants={containerVariants}
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center mb-2">
              <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                {stat.icon}
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <h3 className="text-xl font-bold mb-4 text-gray-800">Inventory Categories</h3>
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6"
        initial="hidden"
        animate={isLoading ? "hidden" : "visible"}
        variants={containerVariants}
      >
        {categories.map((category, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)"
            }}
            className={`bg-white p-4 shadow rounded-lg flex flex-col items-center justify-center cursor-pointer ${
              category.name === 'ALL ITEMS' ? 'border-2 border-blue-400' : ''
            }`}
            onClick={() => {
              if (category.name === 'ALL ITEMS') {
                navigate('/inventory');
              } else {
                navigate(`/inventory/${encodeURIComponent(category.name)}`);
              }
            }}
          >
            <span className="text-4xl mb-2">{category.icon}</span>
            <h4 className="text-lg font-semibold text-center">{category.name}</h4>
          </motion.div>
        ))}
      </motion.div>
      
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;