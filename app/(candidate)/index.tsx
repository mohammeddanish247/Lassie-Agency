import { useLocalSearchParams } from 'expo-router';
import Candidates from '../(drawer)/Candidates/index';

export default function Candidate() {

  const { profileName } : { profileName: string } = useLocalSearchParams();
  
  return (
    <Candidates 
      showFab={false}
      addCandidateRoute="/(candidate)/AddCandidate"
      viewCVRoute="/(candidate)/ViewCV"
      Route='stack'
      profileName={profileName}
    />
  );
}