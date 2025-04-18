'use client'

import { Chart, registerables } from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { getTotalUsers, userTotal } from '../api'
import { User } from '../types'
import CountUp from './CountUp'
import SplitText from './SplitText'
import { Skeleton } from './ui/skeleton'

// Chart.js에서 필요한 모든 요소를 등록합니다.
Chart.register(...registerables)

export default function BarChart() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      const total = await userTotal()
      const usersData = await getTotalUsers(total)
      setUsers(usersData)
      setLoading(false)
    }
    fetchData()
  }, [])

  // 남성과 여성의 키에 따른 사용자 수 분포 계산
  const calculateHeightDistributionByGender = (genders: string) => {
    const heightDistribution = [0, 0, 0, 0, 0] // 각 구역의 사용자 수

    users.reduce((acc, { height, gender }) => {
      // user 객체에서 height 추출
      if (gender === genders) {
        if (height >= 150 && height < 160) acc[0]++
        else if (height >= 160 && height < 170) acc[1]++
        else if (height >= 170 && height < 180) acc[2]++
        else if (height >= 180 && height < 190) acc[3]++
        else if (height >= 190) acc[4]++
      }
      return acc
    }, heightDistribution)

    return heightDistribution
  }

  const maleDistribution = calculateHeightDistributionByGender('male')
  const femaleDistribution = calculateHeightDistributionByGender('female')

  const chartData = {
    labels: ['키 150 이상', '키 160 이상', '키 170 이상', '키 180 이상', '키 190 이상'],
    datasets: [
      {
        label: '남성',
        data: maleDistribution,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        barThickness: 40, // 막대 너비 조정
        categoryPercentage: 0.5, // 각 카테고리의 너비 조정
      },
      {
        label: '여성',
        data: femaleDistribution,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        barThickness: 40, // 막대 너비 조정
        categoryPercentage: 0.5, // 각 카테고리의 너비 조정
      },
    ],
  }

  const totalUsers = users.length // 전체 사용자 수

  const handleAnimationComplete = () => {
    console.log('All letters have animated!')
  }

  if (loading) {
    return (
      <div className="min-w-[1000px] w-1/2 px-20 py-10">
        <div className="flex flex-col space-y-3 py-10">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-[400px] w-[800px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[250px]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-w-[1000px] w-1/2 p-20">
      <SplitText
        text="성별에 따른 키 분포."
        className="text-2xl font-semibold text-center"
        delay={150}
        animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
        animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
        threshold={0.2}
        rootMargin="-50px"
        onLetterAnimationComplete={handleAnimationComplete}
      />
      <Bar data={chartData} />
      <div>
        전체 사용자 수 :{'  '}
        <CountUp from={0} to={totalUsers} separator="," direction="up" duration={1} className="count-up-text" />명
      </div>
    </div>
  )
}
