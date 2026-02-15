import { getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

export const facultyListPage = async (req, res, next) => {
  try {
    const validSortOptions = ['name', 'department', 'title'];
    const sortBy = validSortOptions.includes(req.query.sort) ? req.query.sort : 'department';

    const facultyList = await getSortedFaculty(sortBy);

    res.render('faculty/list', {
      title: 'Faculty Directory',
      faculty: facultyList,
      currentSort: sortBy
    });
  } catch (err) {
    next(err);
  }
};

export const facultyDetailPage = async (req, res, next) => {
  try {
    const facultySlug = req.params.facultySlug; 
    const member = await getFacultyBySlug(facultySlug);

    if (Object.keys(member).length === 0) {  
      const err = new Error(`Faculty member '${facultySlug}' not found`);
      err.status = 404;
      return next(err);
    }

    res.render('faculty/detail', {
      title: `${member.name} - Faculty Profile`,
      faculty: member
    });
  } catch (err) {
    next(err);
  }
};
