// data.js - Contains the extracted words and mapping logic

const data = {
    part1: [
        { id: "p1_1", word: "미리 공유하는", desc: "사전에 상황과 맥락 공유", category: "communication" },
        { id: "p1_2", word: "벽이 없는", desc: "고정관념 탈피, 경계 허물기", category: "culture" },
        { id: "p1_3", word: "긍정적인", desc: "긍정적 실행력", category: "attitude" },
        { id: "p1_4", word: "솔직한", desc: "현재의 고충을 숨기지 않음", category: "communication" },
        { id: "p1_5", word: "든든한", desc: "동료 지지와 응원", category: "culture" },
        { id: "p1_6", word: "존중하는", desc: "타 팀 전문성 인정, 열린 마음", category: "attitude" },
        { id: "p1_7", word: "명확한", desc: "책임감 있고 명확한 피드백", category: "communication" },
        { id: "p1_8", word: "유연한", desc: "상황에 대처하는 자세", category: "system" },
        { id: "p1_9", word: "먼저 다가가는", desc: "먼저 소통을 시도하는 친근함", category: "communication" },
        { id: "p1_10", word: "친절한", desc: "내부 직원에게도 발휘하는 친절", category: "attitude" },
        { id: "p1_11", word: "책임감 있는", desc: "공동 책임감", category: "attitude" },
        { id: "p1_12", word: "끈끈한", desc: "유기적으로 연대하는 의식", category: "culture" },
        { id: "p1_13", word: "간소한", desc: "비고 작성 등 스스로 최소화", category: "system" },
        { id: "p1_14", word: "스마트한", desc: "스마트워크 장점 활용", category: "system" },
        { id: "p1_15", word: "투명하게 나누는", desc: "성과를 타 부서와 공유", category: "communication" },
        { id: "p1_16", word: "분명한", desc: "사각지대 방지, 역할/경계 명확", category: "system" },
        { id: "p1_17", word: "풍성한", desc: "지역 자원 맵핑을 공유", category: "culture" },
        { id: "p1_18", word: "적극적인", 복지관: "행사, ESG 등 TF 동참", category: "attitude" },
        { id: "p1_19", word: "함께 성장하는", desc: "노하우 나누며 동료 슈퍼비전 실천", category: "culture" },
        { id: "p1_20", word: "수용적인", desc: "주민 의견 수용하는 열린 태도", category: "attitude" }
    ],
    part2: [
        { id: "p2_1", word: "다채로운", desc: "공식 소통 채널 다각화", category: "communication" },
        { id: "p2_2", word: "여유로운", desc: "휴게공간과 워라밸 보장", category: "culture" },
        { id: "p2_3", word: "칭찬이 넘치는", desc: "우수직원 포상 문화", category: "culture" },
        { id: "p2_4", word: "존중받는", desc: "인권 경영 시스템 보호", category: "culture" },
        { id: "p2_5", word: "투명한", desc: "운영, 예산 등 투명한 공개", category: "communication" },
        { id: "p2_6", word: "화합하는", desc: "노사위원회 활성화", category: "culture" },
        { id: "p2_7", word: "기회가 열린", desc: "외부 교육 등 경력 개발 기회", category: "system" },
        { id: "p2_8", word: "부드러운", desc: "직급 얽매이지 않고 의견 내는 문화", category: "communication" },
        { id: "p2_9", word: "미더운", desc: "일관성 있어 신뢰받는 리더십", category: "attitude" },
        { id: "p2_10", word: "안정적인", desc: "조율해 주는 안정적 협업 환경", category: "culture" },
        { id: "p2_11", word: "효율적인", desc: "스마트워크로 능률 높이는 시스템", category: "system" },
        { id: "p2_12", word: "균형 잡힌", desc: "특정 팀 치우치지 않게 불균형 배치", category: "system" },
        { id: "p2_13", word: "구체적인", desc: "명확한 실행 매뉴얼", category: "system" },
        { id: "p2_14", word: "일원화된", desc: "소통 누락 막는 일원화된 체계", category: "communication" },
        { id: "p2_15", word: "체계적인", desc: "객관적 평가 및 피드백 제도화", category: "system" },
        { id: "p2_16", word: "통합적인", desc: "효율적인 부서 통합 기획", category: "system" },
        { id: "p2_17", word: "공정한", desc: "승진 및 포상 결정 공정", category: "culture" },
        { id: "p2_18", word: "탄탄한", desc: "직원 역량, 인프라 강화", category: "system" },
        { id: "p2_19", word: "혁신적인", desc: "신규 특화 인큐베이팅 활발", category: "culture" },
        { id: "p2_20", word: "윤리적인", desc: "투명성과 기관 신뢰도 향상", category: "attitude" }
    ],
    // Analysis rules
    analysis: {
        categories: {
            communication: "원활하고 투명한 소통 체계 구축",
            culture: "수평적이고 안전한 조직문화 확립",
            attitude: "상호 존중과 주도적인 업무 태도 형성",
            system: "업무 효율화를 위한 시스템 및 매뉴얼 정비"
        },
        part1Tpl: (traits) => `선택하신 낱말들을 바탕으로 볼 때, 본인 및 사업팀 차원에서는 <strong>${traits}</strong> 등에 가치를 두고 있습니다. 이는 팀 간의 경계를 허물고 상호 협력하기 위해 구성원 개개인이 유연하고 적극적인 자세를 가져야 함을 의미합니다.`,
        part2Tpl: (traits) => `복지관 차원의 지원과 관련하여 <strong>${traits}</strong> 등의 요소가 강조되었습니다. 이는 개인의 노력만으로는 해결하기 어려운 구조적 제약을 해소하기 위해, 기관 차원의 명확한 가이드라인과 제도적 뒷받침이 필수적이라는 것을 시사합니다.`,
        integratedTpl: (mainTrait) => `결합 분석 결과, 현재 우리 팀 및 복지관 조직 전체를 관통하는 핵심 협업 키워드는 <strong>[${mainTrait}]</strong>(으)로 요약됩니다. 구성원의 주도적인 협업 의지가 현장에서 실제로 구현되기 위해서는, 이를 뒷받침할 수 있는 실질적이고 가시적인 운영 시스템과 조직 문화의 개선이 동반되어야 성공적인 '협업 브릿지'를 구축할 수 있습니다.`,

        suggestions: {
            communication: [
                {
                    title: "소통 창구 다각화 및 비공식 교류 활성화",
                    reason: "부서간 칸막이를 없애기 위해서는 업무적 소통 외에도 캐주얼한 정보 교류가 필요합니다.",
                    actionInfo: ["정기적인 '크로스 미팅' (타 부서 참석) 도입", "기관 내 협업 성공 사례 공유 게시판 운영"]
                }
            ],
            culture: [
                {
                    title: "존중과 화합의 인프라 구축",
                    reason: "심리적 안전감이 담보되어야 자유로운 의견 제안과 소신 있는 협업이 진행될 수 있습니다.",
                    actionInfo: ["직급과 무관한 '상호 존중어(님 호칭 등)' 캠페인", "팀 빌딩 데이 등 쉼과 화합이 있는 워크숍 정례화"]
                }
            ],
            attitude: [
                {
                    title: "주도적 협력 유인을 위한 인정 시스템 마련",
                    reason: "자발적으로 협업에 나서는 직원을 독려하고 동기를 부여할 확실한 보상이 필요합니다.",
                    actionInfo: ["동료 간 '마이크로 칭찬/감사' 포인트 제도", "연말 협업 우수 부서/개인 특별 포상 신설"]
                }
            ],
            system: [
                {
                    title: "업무 매뉴얼 일원화 및 스마트워크 고도화",
                    reason: "모호한 경계나 비효율적인 보고 체계는 협업을 늦추고 책임을 전가하는 원인이 됩니다.",
                    actionInfo: ["모호한 업무에 대한 R&R(역할과 책임) 명확화 회의 진행", "불필요한 중복 문서(비고 작성 등) 폐지 추진"]
                }
            ]
        }
    }
};
