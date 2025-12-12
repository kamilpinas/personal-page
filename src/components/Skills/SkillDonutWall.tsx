
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Skill } from '../../lib/skills';
import { iconMap } from '../../lib/icons';

interface SkillDonutWallProps {
  skills: Skill[];
  onSkillClick: (skillId: string) => void;
}

export const SkillDonutWall: React.FC<SkillDonutWallProps> = ({ skills, onSkillClick }) => {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-4 bg-surface-2 rounded-lg">
      {skills.map(skill => {
        const Icon = iconMap[skill.icon];
        const option = {
          series: [
            {
              type: 'gauge',
              startAngle: 90,
              endAngle: -270,
              pointer: {
                show: false
              },
              progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: {
                  borderWidth: 1,
                  borderColor: '#464646'
                }
              },
              axisLine: {
                lineStyle: {
                  width: 4
                }
              },
              splitLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              data: [
                {
                  value: skill.proficiency,
                  name: skill.name,
                  title: {
                    show: false
                  },
                  detail: {
                    show: false
                  }
                }
              ],
              title: {
                fontSize: 14
              },
              detail: {
                width: 50,
                height: 14,
                fontSize: 14,
                color: 'auto',
                borderColor: 'auto',
                borderRadius: 20,
                borderWidth: 1,
                formatter: '{value}%'
              }
            }
          ]
        };

        return (
          <div key={skill.id} className="flex flex-col items-center justify-center gap-2 cursor-pointer" onClick={() => onSkillClick(skill.id)}>
            <ReactECharts option={option} style={{ height: '80px', width: '80px' }} />
            {Icon && <Icon className="w-6 h-6 text-silver-300" />}
            <p className="text-xs text-center text-silver-400">{skill.name}</p>
          </div>
        );
      })}
    </div>
  );
};
