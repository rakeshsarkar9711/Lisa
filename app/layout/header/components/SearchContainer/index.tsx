"use client";

import React, { ChangeEvent, useState, useCallback } from 'react';
import styles from './component.module.css';
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface';
import anilist from '@/app/api/anilist';
import SearchResultItemCard from '@/app/layout/header/components/SearchContainer/components/SearchResultItemCard';
import LoadingIcon from '@/public/assets/ripple-1s-200px.svg';
import SearchIcon from '@/public/assets/search.svg';
import CloseSvg from '@/public/assets/x.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { initFirebase } from '@/app/firebaseApp';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import axios from 'axios';
import { MediaDbOffline } from '@/app/ts/interfaces/dbOffilineInterface';
import { debounce } from 'lodash';

const showUpMotion = {
  hidden: { y: '-40px', opacity: 0 },
  visible: {
    y: '0',
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: { opacity: 0, y: '-120px' },
};

function SearchContainer() {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const db = getFirestore(initFirebase());
  const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<'offline' | 'anilist'>('offline');
  const [searchResults, setSearchResults] = useState<ApiDefaultResult[] | MediaDbOffline[] | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const fetchResultsOnChange = useCallback(
    debounce(async (value: string) => {
      if (value.length <= 2) {
        setSearchResults(null);
        return;
      }

      setIsLoading(true);
      try {
        if (searchType === 'offline') {
          const { data } = await axios.get(`${process.env.NEXT_PUBLIC_NEXT_INTERNAL_API_URL}?title=${value}`);
          setSearchResults(data.data as MediaDbOffline[]);
        } else {
          let showAdultContent = false;
          if (user) {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            showAdultContent = docSnap.exists() ? docSnap.data().showAdultContent : false;
          }
          const result = await anilist.getSeachResults(value, showAdultContent);
          setSearchResults(result as ApiDefaultResult[]);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults(null);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [searchType, user, db]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    fetchResultsOnChange(value);
  };

  const searchValue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchType('anilist');
    fetchResultsOnChange(searchInput);
  };

  const toggleSearchBarMobile = (action: boolean) => {
    setIsMobileSearchBarOpen(action);
    if (!action) {
      setSearchResults(null);
    }
  };

  return (
    <>
      <div id={styles.search_container}>
        <button
          id={styles.btn_open_search_form_mobile}
          onClick={() => toggleSearchBarMobile(!isMobileSearchBarOpen)}
          aria-controls={styles.input_search_bar}
          aria-expanded={isMobileSearchBarOpen}
          aria-label={isMobileSearchBarOpen ? 'Click to Hide Search Bar' : 'Click to Show Search Bar'}
          className={styles.heading_btn}
        >
          <SearchIcon alt="Search Icon" width={16} height={16} />
        </button>

        <div id={styles.form_search}>
          <form onSubmit={searchValue} className={`${styles.search_form} display_flex_row`}>
            <input
              type="text"
              placeholder="Search..."
              name="searchField"
              onChange={handleInputChange}
              value={searchInput}
            />
            <button type="submit" disabled={isLoading} aria-label="Begin Search">
              {isLoading ? <LoadingIcon alt="Loading Icon" width={16} height={16} /> : <SearchIcon alt="Search Icon" width={16} height={16} />}
            </button>
          </form>
        </div>

        <AnimatePresence initial={false} mode="wait">
          {isMobileSearchBarOpen && (
            <motion.div
              id={styles.form_mobile_search}
              aria-expanded={isMobileSearchBarOpen}
              className="display_align_justify_center"
              variants={showUpMotion}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <form onSubmit={searchValue} className={`${styles.search_form} display_flex_row`}>
                <input
                  type="text"
                  placeholder="Search..."
                  name="searchField"
                  disabled={isLoading}
                  onChange={handleInputChange}
                  value={searchInput}
                />
                <button type="submit" disabled={isLoading} aria-label="Begin Search">
                  {isLoading ? <LoadingIcon alt="Loading Icon" width={16} height={16} /> : <SearchIcon alt="Search Icon" width={16} height={16} />}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {searchResults && searchResults.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            id={styles.search_results_container}
          >
            <button onClick={() => setSearchResults(null)} title="Close Search Results">
              <CloseSvg alt="Close Icon" width={16} height={16} />
            </button>
            <ul>
              {searchResults.length === 0 ? (
                <li><p>No results for this search</p></li>
              ) : (
                searchResults.map((item, index) => (
                  <SearchResultItemCard
                    key={index}
                    itemAnilist={searchType === 'anilist' ? item as ApiDefaultResult : undefined}
                    itemOfflineDb={searchType === 'offline' ? item as MediaDbOffline : undefined}
                    onClick={() => toggleSearchBarMobile(false)}
                  />
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SearchContainer;
