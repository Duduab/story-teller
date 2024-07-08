import React, { useState, useRef  } from 'react';
import './App.css';
import AnimalInput from './components/AnimalInput';
import AgeInput from './components/AgeInput';
//import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai"
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from './assets/header-main-logo.png';// Assuming you have a logo file
import axios from 'axios';


function App() {
  const [age, setAge] = useState('');
  const [animal, setAnimal] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [completedStoryArray, setCompletedStoryArray] = useState([]);
  const [loading, setLoading] = useState(false); // State for showing loader
  const storyContainerRef = useRef(null);
  const [imageUrls, setImageUrls] = useState('');

  const handleSubmit = (age, animal) => {
    setLoading(true); // Show loader when submit button is clicked
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);
    const randomFruit = pickRandomFruit();
    const randomAnimalFriend = pickRandomAnimal();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Please write me a book to kids in ${age} years old about ${animal} that love to eat ${randomFruit} and his Best friend is ${randomAnimalFriend}
      please follow the exact instructions:
      1. every page give him number, example: "1. content, 2. content, etc.."
      2. each page will be contain from 2 sentences that rhymes.
      3. write this book especially for ${age} years old and make them happy with this book
      4. the book should be 10 pages at all
      5. make an happy ending to the story
      6. arrange the pages as list of numbers`;

    const promptHb = `בבקשה כתוב לי ספר לילדים בגיל ${age} שנים על ${animal} שאוהבים תפוחים.
    בבקשה עקוב אחר ההוראות המדויקות:
    1. בכל עמוד תן לו מספר
    2. כל עמוד יכיל שני משפטים עם חרוזים.
    3. כתוב את הספר הזה במיוחד עבור ילדים בגיל ${age} שנים והפך אותם למאושרים עם הספר הזה
    4. הספר צריך להיות 10 עמודים בסך הכול
    5. הסיפור צריך לסיים בסוף שמח
    6. סדר את העמודים כרשימה של מספרים`

    const result = model.generateContent(promptHb);
    result.then(res => {
      const output = res.response?.candidates[0]?.content?.parts[0]?.text;
      const storyArray = output.split(/\d+\./).filter(Boolean).map(sentence => sentence.trim());
      const formattedStoryArray = storyArray.map(element => element.replace(/\n/g, ''));
      const modifiedStoryArray = formattedStoryArray.map(element => element.replace(/\*\*/g, ''));
      
      setCompletedStoryArray(modifiedStoryArray);
      setLoading(true); // Show loader when submit button is clicked
      createImages();
    }).catch(error => {
      console.error('Error occurred during content generation:', error);
      setLoading(false); // Hide loader in case of error
    });
  };

  function pickRandomAnimal() {
    const animalElements = [
      "Benny the Bear",
      "Oliver the Owl",
      "Milo the Moose",
      "Sophie the Squirrel",
      "Leo the Lion",
      "Daisy the Deer",
      "Charlie the Cheetah",
      "Luna the Leopard",
      "Max the Monkey",
      "Rosie the Rabbit",
      "Finn the Fox",
      "Ella the Elephant",
      "Sammy the Sloth",
      "Stella the Swan",
      "Gus the Giraffe",
      "Penny the Panda",
      "Riley the Rhino",
      "Mia the Meerkat",
      "Oscar the Orangutan",
      "Lucy the Llama",
      "Toby the Tiger",
      "Molly the Mouse",
      "Winston the Wolf",
      "Zoe the Zebra",
      "Henry the Hippo"
    ];    
    const randomIndex = Math.floor(Math.random() * animalElements.length);
        return animalElements[randomIndex];
  }


  function pickRandomFruit() {
    const fruitElements = [
      "apple", 
      "banana", 
      "carrot", 
      "strawberry", 
      "watermelon",
      "orange",
      "grape",
      "kiwi",
      "peach",
      "pear",
      "pineapple",
      "plum",
      "cherry",
      "mango",
      "blueberry",
      "raspberry",
      "blackberry",
      "lemon",
      "lime",
      "grapefruit",
      "pomegranate",
      "apricot",
      "cantaloupe",
      "fig",
      "guava"
    ];
    const randomIndex = Math.floor(Math.random() * fruitElements.length);
        return fruitElements[randomIndex];
  }

  const createImages = () => {

    const options = {
      method: 'POST',
      url: 'https://api.monsterapi.ai/v1/generate/txt2img',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.REACT_APP_MONSTER_API_KEY}`
      },
      data: {
        aspect_ratio: 'square',
        guidance_scale: 7.5,
        negprompt: 'deformed, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, disgusting, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, blurry, mutated hands,extra fingers',
        prompt: 'detailed sketch of lion by greg rutkowski, beautiful, intricate, ultra realistic, elegant, art by artgerm',
        samples: 2,
        seed: 2414,
        steps: 50,
        style: 'anime'
      }
    };
    
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data.process_id);
        getImage(response.data.process_id)
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  const getImage = (processId) => {
    const options = {
      method: 'GET',
      url: 'https://api.monsterapi.ai/v1/status/' + processId,
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${process.env.REACT_APP_MONSTER_API_KEY}`
      }
    };

    axios
      .request(options)
      .then(function (response) {
        if (response.data.status !== "COMPLETED") {
          setTimeout(() => getImage(processId), 5000); // Wait for 5 seconds before making the next call

        } else {
          setLoading(false); // Hide loader when image is ready
          console.log("Status is COMPLETED");
        }
        if(response && response?.data?.result?.output[0] !== undefined) {
          setImageUrls(response.data.result.output[0])
        }
        console.log(response.data.status);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 2, completedStoryArray.length - 2));
  };
  
  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 2, 0));
  };

  const handleExportToPDF = () => {
    const storyContainer = storyContainerRef.current;
    if (!storyContainer) {
      console.error('Story container element is not available.');
      return;
    }

    html2canvas(storyContainer).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('storybook.pdf');
    }).catch(error => {
      console.error('Error occurred during PDF export:', error);
    });
  };
  

  
  const setAnimalCharacter = (value) => {
    console.log(value);
    console.log(typeof value);
    setAnimal(value);
  }

  const setAgeRange = (value) => {
    console.log(value);
    console.log(typeof value);
    setAge(value);
  }

  return (
    <div className="app-container">
    <header className="app-header">
      <div className="header-content">
        <div>
        <img src={logo} alt="Logo" className="app-logo" />

        </div>
        <h1 className="app-title">Story Teller</h1>
        <p className="app-introduction">
          Welcome to Story Teller! <br/>Create your own stories by filling out the form below.
        </p>
      </div>
    </header>
    <section className="story-info">
      <img src={logo} alt="Logo" className="app-logo" />
      <p>Story Teller is a platform where you can create personalized stories for children of all ages. Simply enter the age and favorite animal of the child, and let our AI generate a unique story tailored just for them!</p>
    </section>
    <div className="form-container">
      <h2 className="form-title">Create Your Story</h2>
      <AnimalInput onChange={(value) => setAnimalCharacter(value)} />
      <AgeInput onChange={(value) => setAgeRange(value)} />
 
      <button className="submit-button" onClick={() => handleSubmit(age, animal)}>Submit</button>
    </div>
    {loading && <div className="loader">Loading...</div>}
    {(!loading && completedStoryArray.length > 0) &&  <div className='book'>
      <div ref={storyContainerRef} className="story-container antique">
          <div className="page left" style={ {flexDirection: 'column-reverse'}}>
          {imageUrls ?
                  <img width="80%" src={imageUrls} alt='image' /> : null 
                }
            <p>{completedStoryArray[currentPage]}</p>
                  </div>
          <hr className="page-divider" />

          <div className="page right" style={ {flexDirection: 'column'}}>
              {imageUrls ?
                  <img width="80%" src={imageUrls} alt='image' /> : null 
                }
            <p>{completedStoryArray[currentPage + 1]}</p>
          </div>
        </div>
    </div>}
    

      {/* Navigation buttons */}
      <div className="navigation-buttons">
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage >= completedStoryArray.length - 2}>Next</button>
        <button onClick={handleExportToPDF}>Export</button>
      </div>
    
      <footer className="footer">
        <p>&copy; 2024 Story Teller. All rights reserved.</p>
        {/* Add your social media icons here */}
      </footer>
    </div>
  );
}

export default App;
