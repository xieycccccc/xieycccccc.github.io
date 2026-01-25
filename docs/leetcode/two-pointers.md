# 双指针

## 介绍
双指针是一种常用的算法技巧，通常用于处理数组或字符串等线性数据结构。它涉及使用两个指针（或索引）来遍历数据结构，以实现高效的解决方案。双指针技术可以分为两种主要类型：
1. **快慢指针**：一个指针移动得比另一个指针快，常用于检测链表中的环或寻找中间节点。
2. **左右指针**：两个指针分别从数据结构的两端向中间移动，常用于排序数组的合并、寻找目标和等问题。


## 示例
### leetcode 283 . 移动零（快慢指针）
使用双指针，左指针指向当前已经处理好的序列的尾部，右指针指向待处理序列的头部。

```cpp
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int n = nums.size(), left = 0, right = 0;
        while (right < n) {
            if (nums[right]) {
                swap(nums[left], nums[right]);
                left++;
            }
            right++;
        }
    }
};

作者：力扣官方题解
链接：https://leetcode.cn/problems/move-zeroes/solutions/489622/yi-dong-ling-by-leetcode-solution/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

### leetcode 11 . 盛最多水的容器（左右指针）

一开始先是直接双重for循环但是时间不够，开始思考规律，想到可以先找到第一第二大的两根，然后分别向左右移动，左右移动扩展时找的是左边或者右边最高的中更高的一根，直到左右指针到两个边界，最后在debug挺久后也是AC了。
虽然对比标答差了一点，但是也算是自己思考出来的，还是挺开心的。
```cpp
class Solution {
public:
    int maxArea(vector<int>& height) {
        int best = 0;
        int temp = 0;

        int best_left = 0;
        int best_right = 0;

        int i, j;

        int big1 = 0;
        int big2 = height.size() - 1;

        for (i = 0; i < height.size(); i++) {
            if (height[i] > height[big1]) {
                big1 = i;
            }
        }

        for (i = 0; i < height.size(); i++) {
            if (height[i] >= height[big2] && i != big1) {
                big2 = i;
            }
        }
        i = min(big1, big2);
        j = max(big1, big2);

        cout << i << j << endl;

        best = min(height[i], height[j]) * (j - i);

        while (!(i == 0 && j == height.size() - 1)) {
            best = max(min(height[i], height[j]) * (j - i), best);

            // 在左右两个小区间里找左max和右max来搞

            if (i > 0) {
                big1 = i - 1;
            } else {
                big1 = 0;
            }
            if (big2 < height.size() - 1) {
                big2 = j + 1;
            }else{
                big2 = height.size()-1;
            }
            for (int index = i - 1; index >= 0; index--) {
                if (height[index] >= height[big1]) {
                    big1 = index;
                }
            }

            for (int index = j + 1; index < height.size(); index++) {
                if (height[index] >= height[big2]) {
                    big2 = index;
                }
            }

            //cout << big1 << big2 << endl;

            if (i!=0&&height[big1] >= height[big2]||j == height.size()-1) {
                i = big1;
            } else if (i == 0 || (j!=height.size()-1&&height[big2] >= height[big1])) {
                j = big2;
            }

            //cout<<"i = "<<i<<"j= "<<j<<endl;
        }
        best = max(min(height[i], height[j]) * (j - i), best);
        return best;
    }
};
```

标答：（左右指针）
左右指针分别指向数组的两端，计算当前面积后，移动较短的那一边的指针，直到两个指针相遇。

原理：
从两端开始计算面积，当移动较短的边时，有可能找到更高的边，从而增加面积。移动较长的边不会增加面积，因为面积受限于较短的边，且移动两端的边距离一定会减少，这样之后可以相当于将那条较短的边扔掉了，继续从边界向中间走。
```cpp
class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int ans = 0;
        while (l < r) {
            int area = min(height[l], height[r]) * (r - l);
            ans = max(ans, area);
            if (height[l] <= height[r]) {
                ++l;
            }
            else {
                --r;
            }
        }
        return ans;
    }
};

作者：力扣官方题解
链接：https://leetcode.cn/problems/container-with-most-water/solutions/207215/sheng-zui-duo-shui-de-rong-qi-by-leetcode-solution/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```


### leetcode 15 . 三数之和（左右指针）
解析：
正常的想法是使用三重循环进行遍历，但是直接遍历一是复杂度很高，O(N^3),二是有重复解的情况，故想到进行一些性质的利用。首先肯定需要排序，让数组有序化（这里假设为升序的）即找到数组(a,b,c),其中a<=b<=c
然后对于第一重的a，寻找剩下的部分。找到后由于题目需要去重，就是a不能重复，故在遍历a时如果发现和上一个a相同就跳过。
对于剩下的部分，由于是1增函数的性质，可以使用双指针，左指针从b开始，右指针从c开始，计算sum=a+b+c
如果sum==-a,则找到一个解，记录下来，然后左指针右移，右指针左移，同时跳过重复的b和c
小于就说明要左边的向右走，大于就说明右边的向左走

```cpp
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // 先排个序吧
        vector<vector<int>> ans;
        sort(nums.begin(), nums.end());

        for (int i = 0; i < nums.size(); i++) {
            // 先到一个不重复的值上或者是第一个
            if (i == 0 || nums[i] != nums[i - 1]) {
                int j = i + 1;
                int k = nums.size() - 1;
                while (j < k) {
                    if (nums[j] + nums[k] == -nums[i]) {
                        ans.push_back({nums[i], nums[j], nums[k]});
                        while (j < nums.size() - 1 && nums[j + 1] == nums[j]) {
                            j++;
                        }
                        j++;
                        while (k > 0 && nums[k - 1] == nums[k]) {
                            k--;
                        }
                        k--;
                    } else if (nums[j] + nums[k] < -nums[i]) {
                        while (j < nums.size() - 1 && nums[j + 1] == nums[j]) {
                            j++;
                        }
                        j++;
                    } else {
                        while (k > 0 && nums[k - 1] == nums[k]) {
                            k--;
                        }
                        k--;
                    }
                }

            } else {
                continue;
            }
        }

        return ans;
    }
};
```


### leetcode 42 . 接雨水（左右指针）
解析：

首先分析雨水的特性：
雨水的多少取决于当前位置左右两边的最高墙的较小值与当前位置墙的高度之差
最开始想到的是遍历每个位置，然后向左向右遍历找最高墙，复杂度O(N^2)，肯定不行

#### 1.动态规划
然后想到可以使用两个数组存储每个位置左边和右边的东西，但是我没有想到动态规划可以达到O(N)的复杂度

从左到右遍历一遍，记录每个位置左边的最高墙
从右到左遍历一遍，记录每个位置右边的最高墙
LeftMax[i] = max(LeftMax[i-1],height[i])
RightMax[i] = max(RightMax[i+1],height[i])


```cpp
class Solution {
public:
    int trap(vector<int>& height) {

        // 存储每个元素左右的max
        vector<int> L(height.size(), height[0]);
        vector<int> R(height.size(), height[height.size() - 1]);

        int ans = 0;

        if (height.size()<2){
            return 0;
        }

        for (int i = 2; i < height.size() ; i++) {
            L[i] = max(height[i - 1], L[i - 1]);
            //cout << i << L[i]<<endl;
        }

        for (int j = height.size() - 3; j >= 1; j--) {
            R[j] = max(height[j + 1], R[j + 1]);
            //cout << j << R[j]<<endl;
        }

        for (int i = 1;i<height.size()-1;i++){
            ans = ans+max(0,min(L[i],R[i])-height[i]);
        }

        return ans;
    }
};
```

#### 2.双指针

上一个动态规划的解法使用了O(N)的额外空间，实际上我们可以使用双指针来优化空间复杂度到O(1)。

原理：
只需要维护两个指针，分别指向数组的两端，同时维护两个变量，记录当前左边和右边的最高墙。
根据当前左边和右边的最高墙，决定移动哪个指针，并计算当前位置的雨水量。

假设我们有两个指针：
left：从数组最左侧（下标 0）开始向右移动
right：从数组最右侧（下标 n-1）开始向左移动
同时维护两个变量：
leftMax：记录 left 指针左侧（包括自身）的最大高度
rightMax：记录 right 指针右侧（包括自身）的最大高度
当 height[left] < height[right] 时：left 位置的接水量只由 leftMax 决定（因为右侧一定有比 height[left] 更高的柱子，rightMax 必然 ≥ leftMax）。
当 height[left] ≥ height[right] 时：right 位置的接水量只由 rightMax 决定（因为左侧一定有比 height[right] 更高的柱子，leftMax 必然 ≥ rightMax）。

#### 3.单调栈
感觉不像人类能想到的解法，直接看题解，但是感觉是很符合重力的感觉了
一、先搞懂：单调栈法的核心逻辑
接雨水的本质是找 “凹槽”—— 一个低的位置，左右都有更高的柱子，才能接住水。单调栈法的核心就是：
维护一个单调递减栈（栈底到栈顶的下标对应的高度越来越小），栈里存的是数组的下标（不是高度值），这样既能拿到高度，又能计算宽度。
遍历数组时，每遇到一个柱子：
如果当前柱子高度 ≤ 栈顶下标对应的高度 → 直接入栈（保持栈的单调递减）；
如果当前柱子高度 > 栈顶下标对应的高度 → 说明找到了一个 “凹槽”：
栈顶元素 = 凹槽的底部（最低处）；
栈顶的下一个元素 = 凹槽的左边界；
当前元素 = 凹槽的右边界；
计算这个凹槽能接的雨水量，然后弹出栈顶（底部），继续检查新的栈顶是否还能和当前元素形成凹槽，直到栈恢复单调递减。
二、先明确：什么是 “单调递减栈”？
举个简单例子，栈里存的是下标，对应的高度是 [3,2,1]，这就是单调递减栈。如果新元素高度是 0，直接入栈（变成 [3,2,1,0]）；如果新元素高度是 2，比栈顶的 1 大，就触发 “找凹槽” 的逻辑。